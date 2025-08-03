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

async function getSpotifyData(accessToken: string, endpoint: string) {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "current" // current, recent
    const limit = parseInt(searchParams.get("limit") || "5", 10)

    // Find user by custom slug
    const userPrefs = await getUserBySlug(slug)

    if (!userPrefs || !userPrefs.privacySettings.isPublic) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Get user's access token from accounts collection
    const db = client.db("spotify-util")
    const accounts = db.collection("accounts")

    const account = await accounts.findOne({
      userId: userPrefs.userId,
      provider: "spotify"
    })

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "No access token available" }, { status: 404 })
    }

    let spotifyData = null

    if (type === "current" && userPrefs.publicDisplaySettings.showCurrentTrack) {
      spotifyData = await getSpotifyData(account.access_token, "/me/player/currently-playing")
    } else if (type === "recent" && userPrefs.publicDisplaySettings.showRecentTracks) {
      const trackLimit = Math.min(limit, userPrefs.publicDisplaySettings.numberOfRecentTracks)
      spotifyData = await getSpotifyData(account.access_token, `/me/player/recently-played?limit=${trackLimit}`)
    }

    // Filter data based on user preferences
    if (spotifyData && type === "current") {
      const track = spotifyData.item
      if (track) {
        const filteredTrack = {
          name: track.name,
          artists: userPrefs.publicDisplaySettings.showArtist ? track.artists : undefined,
          album: userPrefs.publicDisplaySettings.showAlbum ? track.album : undefined,
          duration_ms: userPrefs.publicDisplaySettings.showDuration ? track.duration_ms : undefined,
          external_urls: track.external_urls,
          is_playing: spotifyData.is_playing,
          progress_ms: userPrefs.publicDisplaySettings.showProgress ? spotifyData.progress_ms : undefined,
        }

        return NextResponse.json({
          ...filteredTrack,
          settings: userPrefs.displaySettings,
        })
      }
    } else if (spotifyData && type === "recent") {
      const filteredTracks = spotifyData.items?.map((item: any) => ({
        track: {
          name: item.track.name,
          artists: userPrefs.publicDisplaySettings.showArtist ? item.track.artists : undefined,
          album: userPrefs.publicDisplaySettings.showAlbum ? item.track.album : undefined,
          duration_ms: userPrefs.publicDisplaySettings.showDuration ? item.track.duration_ms : undefined,
          external_urls: item.track.external_urls,
        },
        played_at: item.played_at,
      }))

      return NextResponse.json({
        items: filteredTracks,
        settings: userPrefs.displaySettings,
      })
    }

    return NextResponse.json({ data: null })
  } catch (error) {
    console.error("Error fetching public display data:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}
