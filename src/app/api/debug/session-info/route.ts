import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserPreferences } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user preferences
    let userPrefs = null
    if (session.userId) {
      userPrefs = await getUserPreferences(session.userId)
    }

    return NextResponse.json({
      session: {
        userId: session.userId,
        spotifyId: session.spotifyId,
        user: session.user
      },
      userPreferences: userPrefs,
      debug: {
        message: "This shows what's in your session and what user preferences are found"
      }
    })
  } catch (error) {
    console.error("Error debugging session:", error)
    return NextResponse.json(
      { error: "Failed to debug session" },
      { status: 500 }
    )
  }
}
