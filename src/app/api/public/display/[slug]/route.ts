import { NextRequest, NextResponse } from "next/server"
import { getUserBySlug, getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

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
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 204) {
      return null // No content (not playing)
    }
    throw new Error(`Spotify API error: ${response.status}`)
  }

  return response.json()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('Slug display API called with slug:', slug)

    // Find user by custom slug
    const userPrefs = await getUserBySlug(slug)

    if (!userPrefs) {
      console.log('No user found for slug:', slug)
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    console.log('Found user for slug:', userPrefs.userId)

    // Get user's access token from accounts collection using the correct database
    const db = await getDatabase()  // Use shared database connection
    const accounts = db.collection("accounts")

    const account = await accounts.findOne({
      userId: new ObjectId(userPrefs.userId),
      provider: "spotify"
    })

    if (!account || !account.access_token) {
      console.log('No account or access token found for user')
      return NextResponse.json({ error: "No access token available" }, { status: 404 })
    }

    console.log('Fetching current track from Spotify via slug...')

    let accessToken = account.access_token

    // Try to get current track, refresh token if needed
    try {
      const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')
      console.log('Spotify response via slug:', currentTrack ? 'Got data' : 'No data')

      if (!currentTrack || !currentTrack.item) {
        console.log('No current track via slug - fetching last played track instead')

        // ALWAYS fetch recent tracks to get the last played song
        let recentTracksData = null
        let lastPlayedTrack = null
        try {
          console.log('Fetching recent tracks to get last played song via slug...')
          const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPrefs?.publicDisplaySettings?.numberOfRecentTracks || 10}`)
          if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
            recentTracksData = recentTracks.items.map((item: any) => ({
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album,
              duration_ms: item.track.duration_ms,
              external_urls: item.track.external_urls,
              played_at: item.played_at
            }))

            // Use the most recent track as the main display
            lastPlayedTrack = recentTracks.items[0].track
            console.log('Using last played track as main display via slug:', lastPlayedTrack.name)
          }
        } catch (error) {
          console.log('Error fetching recent tracks when no current track via slug:', error)
        }

        // If we have a last played track, return it as the main track
        if (lastPlayedTrack) {
          const response: any = {
            name: lastPlayedTrack.name,
            is_playing: false, // It's not currently playing
            duration_ms: lastPlayedTrack.duration_ms,
            progress_ms: lastPlayedTrack.duration_ms, // Show as completed
          }

          // Apply user preferences for data visibility
          if (userPrefs?.publicDisplaySettings) {
            const settings = userPrefs.publicDisplaySettings

            if (settings.showArtist) {
              response.artists = lastPlayedTrack.artists
            } else {
              response.artists = []
            }

            if (settings.showAlbum) {
              response.album = lastPlayedTrack.album
            } else {
              response.album = { name: '', images: [] }
            }

            if (settings.showCredits) {
              response.credits = {
                spotify_url: lastPlayedTrack.external_urls?.spotify,
                artists: lastPlayedTrack.artists,
                album: {
                  name: lastPlayedTrack.album.name,
                  spotify_url: lastPlayedTrack.album.external_urls?.spotify
                },
                track_id: lastPlayedTrack.id,
                uri: lastPlayedTrack.uri
              }
            }

            if (settings.showRecentTracks && recentTracksData) {
              response.recent_tracks = recentTracksData
            }
          } else {
            // Default behavior if no preferences found
            response.artists = lastPlayedTrack.artists
            response.album = lastPlayedTrack.album
            response.credits = {
              spotify_url: lastPlayedTrack.external_urls?.spotify,
              artists: lastPlayedTrack.artists,
              album: {
                name: lastPlayedTrack.album.name,
                spotify_url: lastPlayedTrack.album.external_urls?.spotify
              },
              track_id: lastPlayedTrack.id,
              uri: lastPlayedTrack.uri
            }
            response.recent_tracks = recentTracksData || []
          }

          return NextResponse.json({
            ...response,
            preferences: userPrefs
          })
        }

        // Fallback if no recent tracks available
        return NextResponse.json({
          name: 'No recent tracks available',
          artists: [{ name: 'No data' }],
          album: { name: '', images: [] },
          duration_ms: 0,
          is_playing: false,
          progress_ms: 0,
          recent_tracks: [],
          preferences: userPrefs
        })
      }

      console.log('Returning track data via slug:', currentTrack.item.name)

      // Build response based on user preferences
      const response: any = {
        name: currentTrack.item.name,
        is_playing: currentTrack.is_playing
      }

      // Fetch recent tracks if needed
      let recentTracksData = null
      if (userPrefs?.publicDisplaySettings?.showRecentTracks) {
        try {
          const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPrefs.publicDisplaySettings.numberOfRecentTracks || 5}`)
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
          console.log('Error fetching recent tracks via slug:', error)
        }
      }

      // Apply user preferences for data visibility
      if (userPrefs?.publicDisplaySettings) {
        const settings = userPrefs.publicDisplaySettings

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

        // Always show recent tracks if user has that setting enabled
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
        // Always fetch recent tracks in default mode too
        response.recent_tracks = recentTracksData || []
      }

      return NextResponse.json({
        ...response,
        preferences: userPrefs
      })
    } catch (error) {
      // If we get a 401, try to refresh the token
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Slug API - Access token expired, attempting refresh...')

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

          console.log('Slug API - Token refreshed successfully')

          // Retry the request with new token (similar logic as above)
          const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

          if (!currentTrack || !currentTrack.item) {
            // Same fallback logic for refreshed token
            let recentTracksData = null
            let lastPlayedTrack = null
            try {
              const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=10`)
              if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
                recentTracksData = recentTracks.items.map((item: any) => ({
                  name: item.track.name,
                  artists: item.track.artists,
                  album: item.track.album,
                  duration_ms: item.track.duration_ms,
                  external_urls: item.track.external_urls,
                  played_at: item.played_at
                }))
                lastPlayedTrack = recentTracks.items[0].track
              }
            } catch (error) {
              console.log('Error fetching recent tracks after refresh via slug:', error)
            }

            if (lastPlayedTrack) {
              return NextResponse.json({
                name: lastPlayedTrack.name,
                artists: lastPlayedTrack.artists,
                album: lastPlayedTrack.album,
                duration_ms: lastPlayedTrack.duration_ms,
                is_playing: false,
                progress_ms: lastPlayedTrack.duration_ms,
                recent_tracks: recentTracksData || [],
                preferences: userPrefs
              })
            }
          }

          // Return refreshed current track data (simplified for brevity)
          return NextResponse.json({
            name: currentTrack.item.name,
            artists: currentTrack.item.artists,
            album: currentTrack.item.album,
            duration_ms: currentTrack.item.duration_ms,
            is_playing: currentTrack.is_playing,
            progress_ms: currentTrack.progress_ms,
            preferences: userPrefs
          })
        } catch (refreshError) {
          console.error('Slug API - Failed to refresh token:', refreshError)
          throw error // Re-throw original error
        }
      } else {
        throw error // Re-throw non-401 errors
      }
    }
  } catch (error) {
    console.error('Error in slug display API:', error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}
