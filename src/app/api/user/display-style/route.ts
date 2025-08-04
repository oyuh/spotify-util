import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPreferences, updateUserPreferences } from '@/lib/db'
import { displayStyles } from '@/lib/app-themes'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userPrefs = await getUserPreferences(session.userId)
    const currentStyle = userPrefs?.displaySettings?.style || 'minimal'

    return NextResponse.json({
      currentStyle,
      availableStyles: displayStyles,
      customCSS: userPrefs?.displaySettings?.customCSS || ''
    })

  } catch (error) {
    console.error('Error fetching display style:', error)
    return NextResponse.json(
      { error: 'Failed to fetch display style' },
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

    const { styleId, customCSS } = await request.json()

    // Validate style exists (if provided)
    if (styleId) {
      const validStyle = displayStyles.find(style => style.id === styleId)
      if (!validStyle) {
        return NextResponse.json({ error: 'Invalid style ID' }, { status: 400 })
      }
    }

    // Update user preferences
    const currentPrefs = await getUserPreferences(session.userId)
    const updatedDisplaySettings = {
      ...currentPrefs?.displaySettings,
      ...(styleId && { style: styleId }),
      ...(customCSS !== undefined && { customCSS })
    }

    await updateUserPreferences(session.userId, {
      displaySettings: updatedDisplaySettings
    })

    return NextResponse.json({
      success: true,
      style: styleId ? displayStyles.find(s => s.id === styleId) : undefined,
      customCSS
    })

  } catch (error) {
    console.error('Error updating display style:', error)
    return NextResponse.json(
      { error: 'Failed to update display style' },
      { status: 500 }
    )
  }
}
