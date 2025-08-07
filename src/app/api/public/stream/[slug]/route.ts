import { NextRequest, NextResponse } from "next/server"
import { getUserBySlug, getUserPreferences, getUserBySpotifyId } from "@/lib/db"
import { MongoClient } from "mongodb"

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
    console.log('Public Stream API called with slug:', slug)

    // Find user by custom slug
    const userPrefs = await getUserBySlug(slug)

    if (!userPrefs) {
      console.log('Public Stream API - User not found for slug:', slug)
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    console.log('Public Stream API - Found user:', userPrefs.userId)

    // Connect to database
    await client.connect()

    // Get user's access token from accounts collection (same logic as display API)
    const db = client.db("test")
    const accounts = db.collection("accounts")

    // Try multiple ways to find the account (same as display API)
    let account = await accounts.findOne({
      userId: userPrefs.userId,
      provider: "spotify"
    })

    if (!account) {
      console.log('Trying providerAccountId for userId:', userPrefs.userId)
      account = await accounts.findOne({
        providerAccountId: userPrefs.userId,
        provider: "spotify"
      })
    }

    if (!account) {
      console.log('Public Stream API - No account found for user')
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    console.log('Public Stream API - Found account')

    let accessToken = account.access_token

    // Check if token needs refresh
    if (Date.now() >= account.expires_at * 1000) {
      console.log('Public Stream API - Refreshing token')
      const refreshedTokens = await refreshSpotifyToken(account.refresh_token)

      accessToken = refreshedTokens.access_token

      // Update stored tokens
      await accounts.updateOne(
        { _id: account._id },
        {
          $set: {
            access_token: refreshedTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in
          }
        }
      )
    }

    // Get current track (same as display API logic)
    let currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')
    console.log('Public Stream API - Current track data received')

    if (!currentTrack || !currentTrack.item) {
      console.log('Public Stream API - No current track, attempting to fetch recent tracks as fallback')

      try {
        const recentTracks = await getSpotifyData(accessToken, '/me/player/recently-played?limit=1')

        if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
          const lastTrack = recentTracks.items[0].track
          console.log('Public Stream API - Found recent track:', lastTrack.name)

          // Build response based on user preferences (same as display API)
          const response: any = {
            name: lastTrack.name,
            is_playing: false // Recent track is not currently playing
          }

          // Apply user preferences for data visibility
          if (userPrefs?.publicDisplaySettings) {
            const settings = userPrefs.publicDisplaySettings

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
        console.error('Public Stream API - Failed to fetch recent tracks:', recentTracksError)
      }

      return NextResponse.json({
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false
      })
    }

    // Build response for current track (same as display API)
    const response: any = {
      name: currentTrack.item.name,
      is_playing: currentTrack.is_playing
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
        response.external_urls = currentTrack.item.external_urls
      }

      // Include display settings for styling (for stream compatibility)
      if (userPrefs.displaySettings) {
        response.settings = {
          theme: userPrefs.displaySettings.style,
          customCSS: userPrefs.displaySettings.customCSS,
          backgroundImage: userPrefs.displaySettings.backgroundImage,
          position: userPrefs.displaySettings.position
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

    console.log('Public Stream API - Returning track data')
    return NextResponse.json(response)

  } catch (error) {
    console.error('Public Stream API - Error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
