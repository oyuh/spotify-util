import { NextRequest, NextResponse } from "next/server"
import { getUserBySlug } from "@/lib/db"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

interface UserSession {
  userId: string
  spotifyId: string
  access_token: string
  refresh_token: string
  expires_at: number
}

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
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Note: We don't check isPublic here because slug access should work regardless
    // The privacy setting controls whether the regular Spotify ID works, not the slug

    console.log('Public Stream API - Found public user:', userPrefs.userId)

    // Get user's access token from accounts collection
    const db = client.db("test")
    const accounts = db.collection("accounts")

    const account = await accounts.findOne({
      userId: userPrefs.userId,
      provider: "spotify"
    })

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

    // Get current track
    const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')
    console.log('Public Stream API - Current track data received')

    if (!currentTrack || !currentTrack.item) {
      return NextResponse.json({
        name: null,
        artists: null,
        album: null,
        duration_ms: null,
        is_playing: false,
        progress_ms: null,
        external_urls: null,
        settings: userPrefs.publicDisplaySettings || {}
      })
    }

    let recentTracks = []

    // Get recent tracks if enabled in settings
    if (userPrefs.publicDisplaySettings?.showRecentTracks) {
      const limit = userPrefs.publicDisplaySettings?.numberOfRecentTracks || 5
      console.log('Public Stream API - Fetching recent tracks with limit:', limit)

      try {
        const recentData = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${limit}`)
        if (recentData?.items) {
          recentTracks = recentData.items.map((item: any) => ({
            name: item.track.name,
            artists: item.track.artists,
            album: {
              name: item.track.album.name,
              images: item.track.album.images
            },
            duration_ms: item.track.duration_ms,
            external_urls: item.track.external_urls,
            played_at: item.played_at
          }))
        }
      } catch (error) {
        console.error('Public Stream API - Error fetching recent tracks:', error)
      }
    }

    // Enhanced track data for streaming
    const enhancedTrack = {
      name: currentTrack.item.name,
      artists: currentTrack.item.artists,
      album: currentTrack.item.album,
      duration_ms: currentTrack.item.duration_ms,
      is_playing: currentTrack.is_playing,
      progress_ms: currentTrack.progress_ms,
      external_urls: currentTrack.item.external_urls,
      settings: userPrefs.publicDisplaySettings || {},
      recent_tracks: recentTracks,
      // Add credits information for enhanced display
      credits: userPrefs.publicDisplaySettings?.showCredits ? {
        spotify_url: currentTrack.item.external_urls.spotify,
        artists: currentTrack.item.artists,
        album: {
          name: currentTrack.item.album.name,
          spotify_url: currentTrack.item.album.external_urls?.spotify
        },
        track_id: currentTrack.item.id,
        uri: currentTrack.item.uri
      } : undefined
    }

    console.log('Public Stream API - Returning enhanced track data')
    return NextResponse.json(enhancedTrack)

  } catch (error) {
    console.error('Public Stream API - Error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
