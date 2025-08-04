import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Force delete the duplicate user using both string and ObjectId approaches
    const duplicateUserId = "688ed27e187701251fe296a7"

    // Try deleting as string
    const deleteResult1 = await db.collection("user_preferences").deleteOne({
      userId: duplicateUserId
    })

    // Try deleting as ObjectId
    const { ObjectId } = require('mongodb')
    const deleteResult2 = await db.collection("user_preferences").deleteOne({
      userId: new ObjectId(duplicateUserId)
    })

    // Get remaining users
    const remainingUsers = await db.collection("user_preferences").find({}).toArray()

    return NextResponse.json({
      success: true,
      deleteAttempts: {
        asString: deleteResult1.deletedCount,
        asObjectId: deleteResult2.deletedCount
      },
      remainingUsers: remainingUsers.length,
      users: remainingUsers.map(user => ({
        userId: user.userId,
        userIdType: typeof user.userId,
        spotifyId: user.spotifyId,
        customSlug: user.privacySettings?.customSlug || "no slug"
      }))
    })
  } catch (error) {
    console.error("Error force deleting duplicate:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
