import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const oldUserId = "688ed27e187701251fe296a7"  // Current user ID in preferences
    const correctUserId = "688ebe078be59f856ce1882c"  // User ID that has the account/tokens

    // Update the user preferences to use the correct user ID
    const result = await db.collection("user_preferences").updateOne(
      { userId: oldUserId },
      { $set: { userId: correctUserId } }
    )

    return NextResponse.json({
      success: true,
      message: "Updated user preferences to use correct user ID",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      oldUserId,
      correctUserId
    })
  } catch (error) {
    console.error("Error fixing user ID mismatch:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
