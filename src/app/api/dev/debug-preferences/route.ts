import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = client.db("spotify-util")
    const preferencesCollection = db.collection("user_preferences")

    // Check if user has preferences
    const userPreferences = await preferencesCollection.findOne({
      userId: session.userId
    })

    // Get all preferences in collection for debugging
    const allPreferences = await preferencesCollection.find({}).toArray()

    return NextResponse.json({
      userId: session.userId,
      spotifyId: session.spotifyId,
      hasPreferences: !!userPreferences,
      userPreferences,
      totalPreferencesInDB: allPreferences.length,
      allPreferences: allPreferences.map(p => ({
        userId: p.userId,
        spotifyId: p.spotifyId,
        hasPublicDisplay: p.publicDisplaySettings,
        hasPrivacySettings: p.privacySettings,
        hasDisplaySettings: p.displaySettings
      }))
    })
  } catch (error) {
    console.error('Error checking preferences:', error)
    return NextResponse.json({ error: 'Failed to check preferences' }, { status: 500 })
  }
}
