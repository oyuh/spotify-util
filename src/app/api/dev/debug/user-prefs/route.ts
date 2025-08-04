import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPreferences } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userPrefs = await getUserPreferences(session.userId)

    return NextResponse.json({
      userId: session.userId,
      spotifyId: session.spotifyId,
      preferences: userPrefs,
      displayStyle: userPrefs?.displaySettings?.style || 'not set',
      hasPrefs: !!userPrefs
    })

  } catch (error) {
    console.error('Error fetching debug info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch debug info' },
      { status: 500 }
    )
  }
}
