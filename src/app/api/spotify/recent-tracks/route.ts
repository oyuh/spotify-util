import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getSpotifyApi } from "@/lib/spotify"
import { getUserPreferences } from "@/lib/db"
import { logSecurityEvent } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId || !session?.accessToken) {
      logSecurityEvent('UNAUTHORIZED_SPOTIFY_ACCESS', { endpoint: '/api/spotify/recent-tracks' }, request)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "", 10)

    // Validate limit parameter
    if (searchParams.get("limit") && (isNaN(limit) || limit < 1 || limit > 50)) {
      logSecurityEvent('INVALID_PARAMETER', { endpoint: '/api/spotify/recent-tracks', limit }, request)
      return NextResponse.json({ error: "Invalid limit parameter. Must be between 1 and 50." }, { status: 400 })
    }

    // Get user preferences to determine the default number of tracks
    const userPreferences = await getUserPreferences(session.userId)
    const defaultLimit = userPreferences?.publicDisplaySettings?.numberOfRecentTracks || 20

    // Use provided limit or user's preference, then clamp to Spotify API limits (1-50)
    const finalLimit = Math.min(Math.max(limit || defaultLimit, 1), 50)

    const spotify = await getSpotifyApi(session.accessToken)
    const recentTracks = await spotify.getRecentlyPlayed(finalLimit)

    return NextResponse.json(recentTracks)
  } catch (error) {
    console.error("Error fetching recent tracks:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('SPOTIFY_API_ERROR', { endpoint: '/api/spotify/recent-tracks', error: errorMessage }, request)
    return NextResponse.json(
      { error: "Failed to fetch recent tracks" },
      { status: 500 }
    )
  }
}
