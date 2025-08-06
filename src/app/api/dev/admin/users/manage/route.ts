import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

// DEV ONLY: Manage user preferences
export async function GET(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({
        success: false,
        error: 'Valid User ID is required'
      }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid User ID format'
      }, { status: 400 })
    }

    const db = await getDatabase()

    // Get user
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Get user preferences
    const preferences = await db.collection('preferences').findOne({ userId })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive !== false,
          isLocked: user.isLocked === true
        },
        preferences: preferences || null
      }
    })

  } catch (error) {
    console.error('❌ Admin - Get user preferences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Update user preferences
export async function PUT(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({
        success: false,
        error: 'Valid User ID is required'
      }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid User ID format'
      }, { status: 400 })
    }

    const body = await request.json()
    const { preferences, userSettings } = body

    const db = await getDatabase()

    // Check if user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    const results: any = {}

    // Update user settings if provided
    if (userSettings) {
      const userUpdate: any = {}
      if (typeof userSettings.isActive === 'boolean') {
        userUpdate.isActive = userSettings.isActive
      }
      if (typeof userSettings.isLocked === 'boolean') {
        userUpdate.isLocked = userSettings.isLocked
      }
      if (userSettings.name) {
        userUpdate.name = userSettings.name
      }
      if (userSettings.email) {
        userUpdate.email = userSettings.email
      }

      if (Object.keys(userUpdate).length > 0) {
        userUpdate.updatedAt = new Date()
        const userResult = await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: userUpdate }
        )
        results.userUpdate = userResult.modifiedCount
      }
    }

    // Update preferences if provided
    if (preferences) {
      const prefsUpdate = {
        ...preferences,
        updatedAt: new Date()
      }

      const prefsResult = await db.collection('preferences').updateOne(
        { userId },
        { $set: prefsUpdate },
        { upsert: true }
      )
      results.preferencesUpdate = prefsResult.modifiedCount || prefsResult.upsertedCount
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      results
    })

  } catch (error) {
    console.error('❌ Admin - Update user preferences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Reset user preferences to default
export async function POST(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({
        success: false,
        error: 'Valid User ID is required'
      }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid User ID format'
      }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    if (action === 'reset-preferences') {
      // Get current preferences to preserve userId and spotifyId
      const currentPrefs = await db.collection('preferences').findOne({ userId })

      const defaultPreferences = {
        userId,
        spotifyId: currentPrefs?.spotifyId || 'unknown',
        publicDisplaySettings: {
          showCurrentTrack: true,
          showRecentTracks: true,
          showArtist: true,
          showAlbum: true,
          showDuration: true,
          showProgress: true,
          showCredits: false,
          numberOfRecentTracks: 5
        },
        privacySettings: {
          isPublic: true,
          customSlug: undefined,
          hideSpotifyId: false
        },
        appSettings: {
          theme: 'default'
        },
        displaySettings: {
          style: 'default',
          customCSS: undefined,
          backgroundImage: undefined,
          position: undefined
        },
        createdAt: currentPrefs?.createdAt || new Date(),
        updatedAt: new Date()
      }

      const result = await db.collection('preferences').replaceOne(
        { userId },
        defaultPreferences,
        { upsert: true }
      )

      return NextResponse.json({
        success: true,
        message: 'User preferences reset to default',
        result: result.modifiedCount || result.upsertedCount
      })
    }

    if (action === 'unlock') {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            isLocked: false,
            isActive: true,
            updatedAt: new Date()
          }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'User unlocked and activated',
        result: result.modifiedCount
      })
    }

    if (action === 'lock') {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            isLocked: true,
            isActive: false,
            updatedAt: new Date()
          }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'User locked and deactivated',
        result: result.modifiedCount
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: reset-preferences, unlock, lock'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Admin - User action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to perform user action',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
