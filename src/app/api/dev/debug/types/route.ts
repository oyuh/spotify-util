import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Get user preferences with exact field types
    const userPrefs = await db.collection("user_preferences").findOne({
      "privacySettings.customSlug": "adXVE0MbnL0D"
    })

    // Get accounts with exact field types
    const accounts = await db.collection("accounts").find({}).toArray()

    return NextResponse.json({
      userPrefs: userPrefs ? {
        userId: userPrefs.userId,
        userIdType: typeof userPrefs.userId,
        userIdIsObjectId: userPrefs.userId && userPrefs.userId.constructor.name === 'ObjectId'
      } : null,
      accounts: accounts.map(account => ({
        userId: account.userId,
        userIdType: typeof account.userId,
        userIdIsObjectId: account.userId && account.userId.constructor.name === 'ObjectId',
        provider: account.provider,
        providerAccountId: account.providerAccountId
      }))
    })
  } catch (error) {
    console.error("Error in debug types:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
