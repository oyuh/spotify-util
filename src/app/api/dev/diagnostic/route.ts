import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('id')

    if (!identifier) {
      return NextResponse.json({ error: 'No identifier provided. Use ?id=your_spotify_id' })
    }

    const db = client.db("spotify-util")
    const accounts = db.collection("accounts")

    // Try to find the account with this identifier
    const accountByProviderAccountId = await accounts.findOne({
      providerAccountId: identifier,
      provider: "spotify"
    })

    const accountByUserId = await accounts.findOne({
      userId: identifier,
      provider: "spotify"
    })

    // Get all spotify accounts for reference
    const allSpotifyAccounts = await accounts.find({ provider: "spotify" }).toArray()

    return NextResponse.json({
      searchedIdentifier: identifier,
      foundByProviderAccountId: accountByProviderAccountId ? {
        _id: accountByProviderAccountId._id,
        userId: accountByProviderAccountId.userId,
        providerAccountId: accountByProviderAccountId.providerAccountId,
        hasAccessToken: !!accountByProviderAccountId.access_token,
        hasRefreshToken: !!accountByProviderAccountId.refresh_token,
      } : null,
      foundByUserId: accountByUserId ? {
        _id: accountByUserId._id,
        userId: accountByUserId.userId,
        providerAccountId: accountByUserId.providerAccountId,
        hasAccessToken: !!accountByUserId.access_token,
        hasRefreshToken: !!accountByUserId.refresh_token,
      } : null,
      allSpotifyAccounts: allSpotifyAccounts.map(acc => ({
        _id: acc._id,
        userId: acc.userId,
        providerAccountId: acc.providerAccountId,
        hasAccessToken: !!acc.access_token,
        hasRefreshToken: !!acc.refresh_token,
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in diagnostic:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch diagnostic data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
