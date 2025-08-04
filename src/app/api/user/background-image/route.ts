import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateUserPreferences, getUserPreferences } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { backgroundImageUrl, styleId } = body

    if (!backgroundImageUrl) {
      return NextResponse.json({ error: 'Background image URL is required' }, { status: 400 })
    }

    // Get current preferences
    const currentPrefs = await getUserPreferences(session.userId)

    if (!currentPrefs) {
      return NextResponse.json({ error: 'User preferences not found' }, { status: 404 })
    }

    // Update display settings with background image
    const updatedDisplaySettings = {
      ...currentPrefs.displaySettings,
      backgroundImage: backgroundImageUrl,
      style: styleId || currentPrefs.displaySettings.style
    }

    await updateUserPreferences(session.userId, {
      displaySettings: updatedDisplaySettings
    })

    return NextResponse.json({
      success: true,
      message: 'Background image updated successfully',
      displaySettings: updatedDisplaySettings
    })

  } catch (error) {
    console.error('Error updating background image:', error)
    return NextResponse.json(
      { error: 'Failed to update background image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current preferences
    const currentPrefs = await getUserPreferences(session.userId)

    if (!currentPrefs) {
      return NextResponse.json({ error: 'User preferences not found' }, { status: 404 })
    }

    // Remove background image
    const updatedDisplaySettings = {
      ...currentPrefs.displaySettings,
      backgroundImage: undefined
    }

    await updateUserPreferences(session.userId, {
      displaySettings: updatedDisplaySettings
    })

    return NextResponse.json({
      success: true,
      message: 'Background image removed successfully'
    })

  } catch (error) {
    console.error('Error removing background image:', error)
    return NextResponse.json(
      { error: 'Failed to remove background image' },
      { status: 500 }
    )
  }
}
