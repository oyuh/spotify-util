import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Delete the old duplicate user record
    const oldUserId = "688ed27e187701251fe296a7"

    const result = await db.collection("user_preferences").deleteOne({
      userId: oldUserId
    })

    return NextResponse.json({
      success: true,
      message: "Removed duplicate user record",
      deletedCount: result.deletedCount,
      deletedUserId: oldUserId
    })
  } catch (error) {
    console.error("Error cleaning duplicate user:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
