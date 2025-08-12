import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { cleanupDuplicateUserPreferences } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId || !session?.spotifyId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log(`Cleaning up user preferences for userId: ${session.userId}, spotifyId: ${session.spotifyId}`)

    await cleanupDuplicateUserPreferences(session.userId, session.spotifyId)

    return NextResponse.json({
      success: true,
      message: "User preferences cleaned up successfully",
      userId: session.userId,
      spotifyId: session.spotifyId
    })
  } catch (error) {
    console.error("Error cleaning up user preferences:", error)
    return NextResponse.json(
      { error: "Failed to cleanup preferences" },
      { status: 500 }
    )
  }
}
