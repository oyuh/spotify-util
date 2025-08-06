import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { getUserPreferences, getUserBySpotifyId } from '@/lib/db'
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
  { params }: { params: { identifier: string } }
) {
  const { identifier } = await params
  console.log('Stream API called for identifier:', identifier)

  try {
    await client.connect()
    const db = client.db('spotify-util')

    // Use the same logic as display API - look for account by providerAccountId
    const accounts = db.collection("accounts")
    console.log('Looking for account with providerAccountId:', identifier)

    let account = await accounts.findOne({
      providerAccountId: identifier,
      provider: "spotify"
    })

    if (!account) {
      console.log('Stream API - Account not found by providerAccountId')
      return NextResponse.json({
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false
      })
    }

    console.log('Stream API - Account found:', !!account.access_token)

    let accessToken = account.access_token

    try {
      // Try to get current track
      let currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

      if (!currentTrack || !currentTrack.item) {
        console.log('Stream API - No current track, attempting to fetch recent tracks as fallback')

        try {
          const recentTracks = await getSpotifyData(accessToken, '/me/player/recently-played?limit=1')

          if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
            const lastTrack = recentTracks.items[0].track
            console.log('Stream API - Found recent track:', lastTrack.name)

            // Get user preferences to determine what data to return
            console.log('Looking for user preferences by spotifyId:', identifier)
            let userPreferences = await getUserPreferences(identifier)

            // If not found by spotifyId, try looking up by the spotifyId field in preferences
            if (!userPreferences) {
              console.log('Not found by userId, trying getUserBySpotifyId...')
              userPreferences = await getUserBySpotifyId(identifier)
            }

            // If still not found, try the account.userId as fallback
            if (!userPreferences) {
              console.log('Still not found, trying account.userId as fallback:', account.userId)
              userPreferences = await getUserPreferences(account.userId)
            }

            console.log('Stream API - User preferences found for recent track:', userPreferences ? 'Yes' : 'No')

            // Build response based on user preferences
            const response: any = {
              name: lastTrack.name,
              is_playing: false // Recent track is not currently playing
            }

            // Apply user preferences for data visibility
            if (userPreferences?.publicDisplaySettings) {
              const settings = userPreferences.publicDisplaySettings

              if (settings.showArtist) {
                response.artists = lastTrack.artists
              } else {
                response.artists = []
              }

              if (settings.showAlbum) {
                response.album = lastTrack.album
              } else {
                response.album = { name: '', images: [] }
              }

              if (settings.showDuration) {
                response.duration_ms = lastTrack.duration_ms
              }

              if (settings.showCredits) {
                response.external_urls = lastTrack.external_urls
              }
            } else {
              // Default behavior if no preferences found
              response.artists = lastTrack.artists
              response.album = lastTrack.album
              response.duration_ms = lastTrack.duration_ms
              response.external_urls = lastTrack.external_urls
            }

            return NextResponse.json(response)
          }
        } catch (recentTracksError) {
          console.error('Stream API - Failed to fetch recent tracks:', recentTracksError)
        }

        return NextResponse.json({
          name: '',
          artists: [],
          album: { name: '', images: [] },
          is_playing: false
        })
      }

      // Get user preferences to determine what data to return
      console.log('Looking for user preferences by spotifyId:', identifier)
      let userPreferences = await getUserPreferences(identifier)

      // If not found by spotifyId, try looking up by the spotifyId field in preferences
      if (!userPreferences) {
        console.log('Not found by userId, trying getUserBySpotifyId...')
        userPreferences = await getUserBySpotifyId(identifier)
      }

      // If still not found, try the account.userId as fallback
      if (!userPreferences) {
        console.log('Still not found, trying account.userId as fallback:', account.userId)
        userPreferences = await getUserPreferences(account.userId)
      }

      console.log('Stream API - User preferences found:', userPreferences ? 'Yes' : 'No')

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

        // Include display settings for styling
        if (userPreferences.displaySettings) {
          response.settings = {
            theme: userPreferences.displaySettings.style,
            customCSS: userPreferences.displaySettings.customCSS,
            backgroundImage: userPreferences.displaySettings.backgroundImage,
            position: userPreferences.displaySettings.position
          }
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

    } catch (error: any) {
      console.error('Stream API - Error fetching track data:', error)

      // If it's a 401 error, try to refresh the token
      if (error.message?.includes('401')) {
        console.log('Stream API - Access token expired, attempting refresh')

        try {
          const refreshData = await refreshSpotifyToken(account.refresh_token)
          accessToken = refreshData.access_token

          console.log('Stream API - Token refresh successful')

          // Update the access token in the database
          await db.collection('accounts').updateOne(
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
            console.log('Stream API - No current track after refresh, attempting to fetch recent tracks as fallback')

            try {
              const recentTracks = await getSpotifyData(accessToken, '/me/player/recently-played?limit=1')

              if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
                const lastTrack = recentTracks.items[0].track
                console.log('Stream API - Found recent track after refresh:', lastTrack.name)

                // Get user preferences to determine what data to return
                console.log('Looking for user preferences by spotifyId:', identifier)
                let userPreferences = await getUserPreferences(identifier)

                // If not found by spotifyId, try looking up by the spotifyId field in preferences
                if (!userPreferences) {
                  console.log('Not found by userId, trying getUserBySpotifyId...')
                  userPreferences = await getUserBySpotifyId(identifier)
                }

                // If still not found, try the account.userId as fallback
                if (!userPreferences) {
                  console.log('Still not found, trying account.userId as fallback:', account.userId)
                  userPreferences = await getUserPreferences(account.userId)
                }

                console.log('Stream API - User preferences found for recent track after refresh:', userPreferences ? 'Yes' : 'No')

                // Build response based on user preferences
                const response: any = {
                  name: lastTrack.name,
                  is_playing: false // Recent track is not currently playing
                }

                // Apply user preferences for data visibility
                if (userPreferences?.publicDisplaySettings) {
                  const settings = userPreferences.publicDisplaySettings

                  if (settings.showArtist) {
                    response.artists = lastTrack.artists
                  } else {
                    response.artists = []
                  }

                  if (settings.showAlbum) {
                    response.album = lastTrack.album
                  } else {
                    response.album = { name: '', images: [] }
                  }

                  if (settings.showDuration) {
                    response.duration_ms = lastTrack.duration_ms
                  }

                  if (settings.showCredits) {
                    response.external_urls = lastTrack.external_urls
                  }
                } else {
                  // Default behavior if no preferences found
                  response.artists = lastTrack.artists
                  response.album = lastTrack.album
                  response.duration_ms = lastTrack.duration_ms
                  response.external_urls = lastTrack.external_urls
                }

                return NextResponse.json(response)
              }
            } catch (recentTracksError) {
              console.error('Stream API - Failed to fetch recent tracks after refresh:', recentTracksError)
            }

            return NextResponse.json({
              name: '',
              artists: [],
              album: { name: '', images: [] },
              is_playing: false
            })
          }

          // Get user preferences to determine what data to return after refresh
          console.log('Looking for user preferences by spotifyId:', identifier)
          let userPreferences = await getUserPreferences(identifier)

          // If not found by spotifyId, try looking up by the spotifyId field in preferences
          if (!userPreferences) {
            console.log('Not found by userId, trying getUserBySpotifyId...')
            userPreferences = await getUserBySpotifyId(identifier)
          }

          // If still not found, try the account.userId as fallback
          if (!userPreferences) {
            console.log('Still not found, trying account.userId as fallback:', account.userId)
            userPreferences = await getUserPreferences(account.userId)
          }

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
