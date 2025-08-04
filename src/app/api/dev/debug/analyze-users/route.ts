import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Get all user preferences
    const userPrefs = await db.collection("user_preferences").find({}).toArray()

    // Get all accounts
    const accounts = await db.collection("accounts").find({}).toArray()

    // Find which account has the Spotify tokens
    const spotifyAccount = accounts.find(acc => acc.provider === "spotify" && acc.providerAccountId === "lawsonhart")

    return NextResponse.json({
      userPreferences: userPrefs.map(user => ({
        userId: user.userId,
        spotifyId: user.spotifyId,
        customSlug: user.privacySettings?.customSlug || "no slug",
        isPublic: user.privacySettings?.isPublic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      accounts: accounts.map(acc => ({
        userId: acc.userId,
        userIdType: typeof acc.userId,
        provider: acc.provider,
        providerAccountId: acc.providerAccountId,
        hasTokens: !!(acc.access_token && acc.refresh_token)
      })),
      analysis: {
        spotifyAccountUserId: spotifyAccount?.userId?.toString(),
        needsCleanup: userPrefs.length > 1,
        recommendation: spotifyAccount ? `Keep user record that matches account userId: ${spotifyAccount.userId.toString()}` : "No Spotify account found"
      }
    })
  } catch (error) {
    console.error("Error analyzing user data:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
