import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const correctUserId = "688ebe078be59f856ce1882c"  // Has the Spotify account
    const duplicateUserId = "688ed27e187701251fe296a7"  // Duplicate to delete

    // Get the correct user data before deletion
    const correctUser = await db.collection("user_preferences").findOne({ userId: correctUserId })
    const duplicateUser = await db.collection("user_preferences").findOne({ userId: duplicateUserId })

    if (!correctUser) {
      return NextResponse.json({ error: "Correct user not found" }, { status: 404 })
    }

    // Delete the duplicate user
    const deleteResult = await db.collection("user_preferences").deleteOne({
      userId: duplicateUserId
    })

    // Also check for any sessions or other data pointing to the duplicate
    const sessions = await db.collection("sessions").find({}).toArray()
    const accounts = await db.collection("accounts").find({}).toArray()

    return NextResponse.json({
      success: true,
      message: "Cleaned up duplicate user data",
      actions: {
        deletedDuplicateUser: deleteResult.deletedCount > 0,
        correctUserData: {
          userId: correctUser.userId,
          spotifyId: correctUser.spotifyId,
          customSlug: correctUser.privacySettings?.customSlug,
          hasSpotifyAccount: accounts.some(acc => acc.userId.toString() === correctUserId)
        },
        duplicateUserData: duplicateUser ? {
          userId: duplicateUser.userId,
          spotifyId: duplicateUser.spotifyId,
          customSlug: duplicateUser.privacySettings?.customSlug
        } : null
      },
      sessions: sessions.length,
      recommendations: [
        "Log out and log back in to refresh your session",
        "Check that your session points to the correct user ID"
      ]
    })
  } catch (error) {
    console.error("Error cleaning up user data:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
