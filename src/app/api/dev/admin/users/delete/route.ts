import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

// DEV ONLY: Delete a user and all associated data
export async function DELETE(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const confirm = searchParams.get('confirm') === 'true'
    const force = searchParams.get('force') === 'true'

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: 'Confirmation required. Add ?confirm=true to proceed'
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

    // Get user preferences to get spotifyId
    const preferences = await db.collection('preferences').findOne({ userId })

    // Start deleting all user data
    const results = {
      users: 0,
      accounts: 0,
      sessions: 0,
      preferences: 0,
      views: 0
    }

    // Delete from all collections
    const userResult = await db.collection('users').deleteOne({ _id: new ObjectId(userId) })
    results.users = userResult.deletedCount

    const accountsResult = await db.collection('accounts').deleteMany({ userId: new ObjectId(userId) })
    results.accounts = accountsResult.deletedCount

    const sessionsResult = await db.collection('sessions').deleteMany({ userId: new ObjectId(userId) })
    results.sessions = sessionsResult.deletedCount

    const prefsResult = await db.collection('preferences').deleteMany({ userId })
    results.preferences = prefsResult.deletedCount

    // If we have spotifyId, also clean up by spotifyId
    if (preferences?.spotifyId) {
      await db.collection('preferences').deleteMany({ spotifyId: preferences.spotifyId })
    }

    // Delete any analytics data
    const viewsResult1 = await db.collection('views').deleteMany({ userId })
    if (preferences?.spotifyId) {
      const viewsResult2 = await db.collection('views').deleteMany({ spotifyId: preferences.spotifyId })
      results.views = viewsResult1.deletedCount + viewsResult2.deletedCount
    } else {
      results.views = viewsResult1.deletedCount
    }

    return NextResponse.json({
      success: true,
      message: `User ${userId} and all associated data deleted successfully`,
      deletedUser: {
        id: userId,
        name: user.name,
        email: user.email,
        spotifyId: preferences?.spotifyId
      },
      deletedCounts: results
    })

  } catch (error) {
    console.error('❌ Admin - Delete user error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get user details before deletion
export async function GET(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
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

    // Get related data counts
    const accounts = await db.collection('accounts').countDocuments({ userId: new ObjectId(userId) })
    const sessions = await db.collection('sessions').countDocuments({ userId: new ObjectId(userId) })
    const preferences = await db.collection('preferences').findOne({ userId })
    const preferencesCount = await db.collection('preferences').countDocuments({ userId })

    let viewsCount = 0
    if (preferences?.spotifyId) {
      viewsCount = await db.collection('views').countDocuments({
        $or: [
          { userId },
          { spotifyId: preferences.spotifyId }
        ]
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          lastLoginDate: user.lastLoginDate,
          isActive: user.isActive !== false,
          isLocked: user.isLocked === true
        },
        relatedData: {
          accounts,
          sessions,
          preferences: preferencesCount,
          views: viewsCount,
          spotifyId: preferences?.spotifyId
        },
        warnings: [
          'This will permanently delete the user and ALL associated data',
          'This action cannot be undone',
          'All accounts, sessions, preferences, and analytics will be removed'
        ]
      }
    })

  } catch (error) {
    console.error('❌ Admin - Get user deletion info error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get user deletion info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
