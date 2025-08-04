import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const collection = db.collection("user_preferences")

    // Get all users to see what we have
    const allUsers = await collection.find({}).toArray()

    return NextResponse.json({
      totalUsers: allUsers.length,
      users: allUsers.map(user => ({
        userId: user.userId,
        spotifyId: user.spotifyId,
        customSlug: user.privacySettings?.customSlug || "no slug",
        isPublic: user.privacySettings?.isPublic ?? true,
        lastActivity: user.lastActivity
      }))
    })
  } catch (error) {
    console.error("Error in debug all-users:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
