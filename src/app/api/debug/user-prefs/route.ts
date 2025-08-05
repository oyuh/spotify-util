import { NextRequest, NextResponse } from 'next/server'
import { getUserPreferences, getUserBySpotifyId } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier') || 'lawsonhart'

    console.log('🔍 DEBUG: Looking up user preferences for:', identifier)

    // Try multiple ways to find user preferences
    let userPrefs1 = await getUserPreferences(identifier)
    let userPrefs2 = await getUserBySpotifyId(identifier)

    // Also try looking by ObjectId if it looks like one
    let userPrefs3 = null
    if (identifier.startsWith('688ed27e')) {
      userPrefs3 = await getUserPreferences(identifier)
    }

    return NextResponse.json({
      identifier,
      userPreferences_byUserId: userPrefs1,
      userPreferences_bySpotifyId: userPrefs2,
      userPreferences_byObjectId: userPrefs3,
      summary: {
        hasDisplaySettings: !!(userPrefs1?.displaySettings || userPrefs2?.displaySettings || userPrefs3?.displaySettings),
        displaySettings1: userPrefs1?.displaySettings,
        displaySettings2: userPrefs2?.displaySettings,
        displaySettings3: userPrefs3?.displaySettings,
        publicDisplaySettings1: userPrefs1?.publicDisplaySettings,
        publicDisplaySettings2: userPrefs2?.publicDisplaySettings,
        publicDisplaySettings3: userPrefs3?.publicDisplaySettings,
      }
    })
  } catch (error) {
    console.error('Error in debug API:', error)
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 })
  }
}
