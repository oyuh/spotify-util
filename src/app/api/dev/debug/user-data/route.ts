import { NextRequest, NextResponse } from "next/server"
import { getUserBySlug, getUserBySpotifyId } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')

    if (!identifier) {
      return NextResponse.json({ error: "No identifier provided" }, { status: 400 })
    }

    // Check both slug and spotify ID regardless of format
    let userData = null
    let searchType = ""

    // First try as spotify ID
    userData = await getUserBySpotifyId(identifier)
    if (userData) {
      searchType = "spotify_id"
    } else {
      // Then try as slug
      userData = await getUserBySlug(identifier)
      if (userData) {
        searchType = "slug"
      } else {
        searchType = "not_found"
      }
    }

    return NextResponse.json({
      identifier,
      searchType,
      found: !!userData,
      userData: userData ? {
        userId: userData.userId,
        spotifyId: userData.spotifyId,
        privacySettings: userData.privacySettings,
        hasSlug: !!userData.privacySettings?.customSlug
      } : null
    })
  } catch (error) {
    console.error("Error in debug user-data:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
