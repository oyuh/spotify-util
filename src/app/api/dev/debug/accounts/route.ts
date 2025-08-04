import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const accounts = db.collection("accounts")

    // Get all accounts to see what we have
    const allAccounts = await accounts.find({}).toArray()

    return NextResponse.json({
      totalAccounts: allAccounts.length,
      accounts: allAccounts.map(account => ({
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        hasAccessToken: !!account.access_token,
        hasRefreshToken: !!account.refresh_token,
        expires_at: account.expires_at
      }))
    })
  } catch (error) {
    console.error("Error in debug accounts:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
