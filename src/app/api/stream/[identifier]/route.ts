import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { getUserPreferences } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const client = new MongoClient(process.env.MONGODB_URI!)

async function refreshSpotifyToken(refreshToken: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`)
  }

  return response.json()
}

async function getSpotifyData(accessToken: string, endpoint: string) {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  console.log(`Spotify API response: ${response.status} for endpoint: ${endpoint}`)

  if (!response.ok) {
    if (response.status === 204) {
      return null // No content (not playing)
    }
    const errorText = await response.text()
    console.error(`Spotify API error ${response.status}: ${errorText}`)
    throw new Error(`Spotify API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params
    console.log('Stream API called with identifier:', identifier)

    // Connect to database
    const db = client.db("test")
    const accounts = db.collection("accounts")

    console.log('Stream API - Looking for account with identifier:', identifier)

    // Try multiple ways to find the account
    let account = await accounts.findOne({
      providerAccountId: identifier,
      provider: "spotify"
    })

    // If not found, try looking by userId
    if (!account) {
      console.log('Stream API - Not found by providerAccountId, trying userId...')
      account = await accounts.findOne({
        userId: identifier,
        provider: "spotify"
      })
    }

    console.log('Stream API - Found account:', account ? 'Yes' : 'No')

    if (!account || !account.access_token) {
      return NextResponse.json({
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false,
        error: 'No access token available'
      })
    }

    let accessToken = account.access_token

    // Try to get current track, refresh token if needed
    try {
      const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

      if (!currentTrack || !currentTrack.item) {
        return NextResponse.json({
          name: '',
          artists: [],
          album: { name: '', images: [] },
          is_playing: false
        })
      }

      // Get user preferences to determine what data to return
      // We need to get the userId from session, not from the account record
      // because the account record might have a different userId format
      let sessionUserId = account.userId

      // Check if we can find the actual session userId by looking for a user_preferences record
      // that was created/updated with the same spotifyId as this account
      const db2 = client.db("test")
      const userPreferencesCollection = db2.collection("user_preferences")

      // Try to find preferences by spotifyId first, since that's what we know for sure
      const existingPrefs = await userPreferencesCollection.findOne({
        spotifyId: identifier
      })

      if (existingPrefs) {
        sessionUserId = existingPrefs.userId
        console.log('Stream API - Found existing preferences, using userId:', sessionUserId)
      }

      console.log('Stream API - Looking for user preferences with userId:', sessionUserId)
      const userPreferences = await getUserPreferences(sessionUserId)
      console.log('Stream API - User preferences found:', userPreferences ? 'Yes' : 'No')
      if (userPreferences) {
        console.log('Stream API - User preferences data:', JSON.stringify(userPreferences.publicDisplaySettings, null, 2))
      }

      // Build response based on user preferences
      const response: any = {
        name: currentTrack.item.name,
        is_playing: currentTrack.is_playing
      }

      // Fetch recent tracks if needed
      let recentTracksData = null
      if (userPreferences?.publicDisplaySettings?.showRecentTracks) {
        try {
          const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPreferences.publicDisplaySettings.numberOfRecentTracks || 5}`)
          if (recentTracks && recentTracks.items) {
            recentTracksData = recentTracks.items.map((item: any) => ({
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album,
              duration_ms: item.track.duration_ms,
              external_urls: item.track.external_urls,
              played_at: item.played_at
            }))
          }
        } catch (error) {
          console.log('Stream API - Error fetching recent tracks:', error)
        }
      }

      // Apply user preferences for data visibility
      if (userPreferences?.publicDisplaySettings) {
        const settings = userPreferences.publicDisplaySettings

        if (settings.showArtist) {
          response.artists = currentTrack.item.artists
        } else {
          response.artists = []
        }

        if (settings.showAlbum) {
          response.album = currentTrack.item.album
        } else {
          response.album = { name: '', images: [] }
        }

        if (settings.showDuration) {
          response.duration_ms = currentTrack.item.duration_ms
        }

        if (settings.showProgress) {
          response.progress_ms = currentTrack.progress_ms
        }

        if (settings.showCredits) {
          // Enhanced credits information
          response.credits = {
            spotify_url: currentTrack.item.external_urls?.spotify,
            artists: currentTrack.item.artists,
            album: {
              name: currentTrack.item.album.name,
              spotify_url: currentTrack.item.album.external_urls?.spotify
            },
            track_id: currentTrack.item.id,
            uri: currentTrack.item.uri
          }
        }

        if (settings.showRecentTracks && recentTracksData) {
          response.recent_tracks = recentTracksData
        }
      } else {
        // Default behavior if no preferences found
        response.artists = currentTrack.item.artists
        response.album = currentTrack.item.album
        response.duration_ms = currentTrack.item.duration_ms
        response.progress_ms = currentTrack.progress_ms
        response.credits = {
          spotify_url: currentTrack.item.external_urls?.spotify,
          artists: currentTrack.item.artists,
          album: {
            name: currentTrack.item.album.name,
            spotify_url: currentTrack.item.album.external_urls?.spotify
          },
          track_id: currentTrack.item.id,
          uri: currentTrack.item.uri
        }
      }

      return NextResponse.json(response)
    } catch (error) {
      // If we get a 401, try to refresh the token
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Stream API - Access token expired, attempting refresh...')

        if (!account.refresh_token) {
          throw new Error('No refresh token available')
        }

        try {
          const refreshData = await refreshSpotifyToken(account.refresh_token)
          accessToken = refreshData.access_token

          // Update the token in the database
          await accounts.updateOne(
            { _id: account._id },
            {
              $set: {
                access_token: accessToken,
                expires_at: Math.floor(Date.now() / 1000) + refreshData.expires_in
              }
            }
          )

          console.log('Stream API - Token refreshed successfully')

          // Retry the request with new token
          const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

          if (!currentTrack || !currentTrack.item) {
            return NextResponse.json({
              name: '',
              artists: [],
              album: { name: '', images: [] },
              is_playing: false
            })
          }

          // Get user preferences to determine what data to return after refresh
          const userPreferences = await getUserPreferences(account.userId)
          console.log('Stream API - User preferences found after refresh:', userPreferences ? 'Yes' : 'No')

          // Build response based on user preferences
          const response: any = {
            name: currentTrack.item.name,
            is_playing: currentTrack.is_playing
          }

          // Apply user preferences for data visibility
          if (userPreferences?.publicDisplaySettings) {
            const settings = userPreferences.publicDisplaySettings

            if (settings.showArtist) {
              response.artists = currentTrack.item.artists
            } else {
              response.artists = []
            }

            if (settings.showAlbum) {
              response.album = currentTrack.item.album
            } else {
              response.album = { name: '', images: [] }
            }

            if (settings.showDuration) {
              response.duration_ms = currentTrack.item.duration_ms
            }

            if (settings.showProgress) {
              response.progress_ms = currentTrack.progress_ms
            }

            if (settings.showCredits) {
              response.external_urls = currentTrack.item.external_urls
            }
          } else {
            // Default behavior if no preferences found
            response.artists = currentTrack.item.artists
            response.album = currentTrack.item.album
            response.duration_ms = currentTrack.item.duration_ms
            response.progress_ms = currentTrack.progress_ms
            response.external_urls = currentTrack.item.external_urls
          }

          return NextResponse.json(response)
        } catch (refreshError) {
          console.error('Stream API - Failed to refresh token:', refreshError)
          throw error // Re-throw original error
        }
      } else {
        throw error // Re-throw non-401 errors
      }
    }
  } catch (error) {
    console.error('Error in stream API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      name: '',
      artists: [],
      album: { name: '', images: [] },
      is_playing: false,
      error: `Failed to fetch track data: ${errorMessage}`
    }, { status: 500 })
  }
}
