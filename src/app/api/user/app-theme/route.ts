import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPreferences, updateUserPreferences } from '@/lib/db'
import { appThemes } from '@/lib/app-themes'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userPrefs = await getUserPreferences(session.userId)
    const currentTheme = userPrefs?.appSettings?.theme || 'dark'

    return NextResponse.json({
      currentTheme,
      availableThemes: appThemes
    })

  } catch (error) {
    console.error('Error fetching app theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app theme' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { themeId } = await request.json()

    // Validate theme exists
    const validTheme = appThemes.find(theme => theme.id === themeId)
    if (!validTheme) {
      return NextResponse.json({ error: 'Invalid theme ID' }, { status: 400 })
    }

    // Update user preferences
    const currentPrefs = await getUserPreferences(session.userId)
    await updateUserPreferences(session.userId, {
      appSettings: {
        ...currentPrefs?.appSettings,
        theme: themeId
      }
    })

    return NextResponse.json({
      success: true,
      theme: validTheme
    })

  } catch (error) {
    console.error('Error updating app theme:', error)
    return NextResponse.json(
      { error: 'Failed to update app theme' },
      { status: 500 }
    )
  }
}
