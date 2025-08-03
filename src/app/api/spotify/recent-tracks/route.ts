import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getSpotifyApi } from "@/lib/spotify"
import { getUserPreferences } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "", 10)

    // Get user preferences to determine the default number of tracks
    const userPreferences = await getUserPreferences(session.userId)
    const defaultLimit = userPreferences?.publicDisplaySettings?.numberOfRecentTracks || 20

    // Use provided limit or user's preference, then clamp to Spotify API limits (1-50)
    const finalLimit = Math.min(Math.max(limit || defaultLimit, 1), 50)

    console.log('Recent tracks API - Using limit:', finalLimit, 'from user preference:', defaultLimit)

    const spotify = await getSpotifyApi(session.accessToken!)
    const recentTracks = await spotify.getRecentlyPlayed(finalLimit)

    return NextResponse.json(recentTracks)
  } catch (error) {
    console.error("Error fetching recent tracks:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent tracks" },
      { status: 500 }
    )
  }
}
