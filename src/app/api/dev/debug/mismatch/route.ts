import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // User preference user ID
    const prefUserId = "688ed27e187701251fe296a7"
    // Account user ID
    const accountUserId = "688ebe078be59f856ce1882c"

    // Check user preferences
    const userPrefs = await db.collection("user_preferences").findOne({ userId: prefUserId })
    const accountPrefs = await db.collection("user_preferences").findOne({ userId: accountUserId })

    // Check accounts
    const prefAccount = await db.collection("accounts").findOne({ userId: prefUserId })
    const mainAccount = await db.collection("accounts").findOne({ userId: accountUserId })

    return NextResponse.json({
      userPreferenceUserId: prefUserId,
      accountUserId: accountUserId,
      userPreferences: {
        prefUserId: !!userPrefs,
        accountUserId: !!accountPrefs,
        prefUserData: userPrefs ? {
          spotifyId: userPrefs.spotifyId,
          customSlug: userPrefs.privacySettings?.customSlug
        } : null,
        accountUserData: accountPrefs ? {
          spotifyId: accountPrefs.spotifyId,
          customSlug: accountPrefs.privacySettings?.customSlug
        } : null
      },
      accounts: {
        prefUserId: !!prefAccount,
        accountUserId: !!mainAccount,
        prefAccountData: prefAccount ? {
          provider: prefAccount.provider,
          providerAccountId: prefAccount.providerAccountId
        } : null,
        mainAccountData: mainAccount ? {
          provider: mainAccount.provider,
          providerAccountId: mainAccount.providerAccountId
        } : null
      }
    })
  } catch (error) {
    console.error("Error in debug mismatch:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
