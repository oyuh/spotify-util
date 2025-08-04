import { NextRequest, NextResponse } from "next/server"
import { getUserBySlug, getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const slug = "adXVE0MbnL0D"

    // Find user by custom slug
    const userPrefs = await getUserBySlug(slug)
    console.log('getUserBySlug result:', userPrefs)

    if (!userPrefs) {
      return NextResponse.json({ error: "No user found for slug" }, { status: 404 })
    }

    console.log('Found user for slug:', userPrefs.userId)

    // Get user's access token from accounts collection
    const db = await getDatabase()
    const accounts = db.collection("accounts")

    console.log('Looking for account with userId:', userPrefs.userId)

    const account = await accounts.findOne({
      userId: userPrefs.userId,
      provider: "spotify"
    })

    console.log('Account lookup result:', account ? 'Found' : 'Not found')
    if (account) {
      console.log('Account details:', {
        userId: account.userId,
        provider: account.provider,
        hasAccessToken: !!account.access_token,
        hasRefreshToken: !!account.refresh_token
      })
    }

    return NextResponse.json({
      slug,
      userPrefs: {
        userId: userPrefs.userId,
        spotifyId: userPrefs.spotifyId
      },
      accountFound: !!account,
      accountDetails: account ? {
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        hasAccessToken: !!account.access_token,
        hasRefreshToken: !!account.refresh_token
      } : null
    })
  } catch (error) {
    console.error("Error in debug slug-account:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
