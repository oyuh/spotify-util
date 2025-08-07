import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getSpotifyApi } from "@/lib/spotify"
import { logSecurityEvent } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId || !session?.accessToken) {
      logSecurityEvent('UNAUTHORIZED_SPOTIFY_ACCESS', { endpoint: '/api/spotify/current-track' }, request)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const spotify = await getSpotifyApi(session.accessToken)
    const currentTrack = await spotify.getCurrentlyPlaying()

    return NextResponse.json(currentTrack)
  } catch (error) {
    console.error("Error fetching current track:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('SPOTIFY_API_ERROR', { endpoint: '/api/spotify/current-track', error: errorMessage }, request)
    return NextResponse.json(
      { error: "Failed to fetch current track" },
      { status: 500 }
    )
  }
}
