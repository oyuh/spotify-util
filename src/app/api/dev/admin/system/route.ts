import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

// DEV ONLY: System admin operations
export async function GET(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const db = await getDatabase()

    if (action === 'stats') {
      // Get comprehensive system statistics
      const [
        totalUsers,
        activeUsers,
        lockedUsers,
        totalAccounts,
        totalPreferences,
        publicUsers,
        privateUsers,
        usersWithCustomSlugs,
        usersWithBackgroundImages,
        recentUsers
      ] = await Promise.all([
        db.collection('users').countDocuments({}),
        db.collection('users').countDocuments({ isActive: { $ne: false } }),
        db.collection('users').countDocuments({ isLocked: true }),
        db.collection('accounts').countDocuments({}),
        db.collection('preferences').countDocuments({}),
        db.collection('preferences').countDocuments({ 'privacySettings.isPublic': true }),
        db.collection('preferences').countDocuments({ 'privacySettings.isPublic': false }),
        db.collection('preferences').countDocuments({ 'privacySettings.customSlug': { $exists: true, $ne: null } }),
        db.collection('preferences').countDocuments({ 'displaySettings.backgroundImage': { $exists: true, $ne: null } }),
        db.collection('users').find({}).sort({ createdAt: -1 }).limit(5).toArray()
      ])

      return NextResponse.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            active: activeUsers,
            locked: lockedUsers,
            withAccounts: totalAccounts,
            withPreferences: totalPreferences
          },
          privacy: {
            public: publicUsers,
            private: privateUsers
          },
          customization: {
            customSlugs: usersWithCustomSlugs,
            backgroundImages: usersWithBackgroundImages
          },
          recent: recentUsers.map(user => ({
            id: user._id.toString(), // Convert MongoDB _id to string
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            isActive: user.isActive !== false,
            isLocked: user.isLocked === true
          }))
        }
      })
    }

    if (action === 'health') {
      // Check database health
      const collections = ['users', 'accounts', 'preferences', 'sessions']
      const health: Record<string, any> = {}

      for (const collection of collections) {
        try {
          const count = await db.collection(collection).countDocuments({})
          const lastUpdated = await db.collection(collection)
            .findOne({}, { sort: { updatedAt: -1 } })

          health[collection] = {
            status: 'healthy',
            count,
            lastUpdated: lastUpdated?.updatedAt || lastUpdated?.createdAt || null
          }
        } catch (error) {
          health[collection] = {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          database: 'connected',
          collections: health,
          timestamp: new Date()
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: stats, health'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Admin - System stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get system stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// System maintenance operations
export async function POST(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()

    const db = await getDatabase()

    if (action === 'cleanup-orphaned') {
      // Find and remove orphaned records
      const results = {
        orphanedAccounts: 0,
        orphanedPreferences: 0,
        orphanedSessions: 0
      }

      // Get all user IDs
      const users = await db.collection('users').find({}, { projection: { _id: 1 } }).toArray()
      const userIds = users.map(u => u._id.toString())
      const userObjectIds = users.map(u => u._id)

      // Find orphaned accounts (accounts without users)
      const orphanedAccounts = await db.collection('accounts').find({
        userId: { $nin: userObjectIds }
      }).toArray()

      if (orphanedAccounts.length > 0) {
        const deleteAccountsResult = await db.collection('accounts').deleteMany({
          userId: { $nin: userObjectIds }
        })
        results.orphanedAccounts = deleteAccountsResult.deletedCount || 0
      }

      // Find orphaned preferences (preferences without users)
      const orphanedPreferences = await db.collection('preferences').find({
        userId: { $nin: userIds }
      }).toArray()

      if (orphanedPreferences.length > 0) {
        const deletePrefsResult = await db.collection('preferences').deleteMany({
          userId: { $nin: userIds }
        })
        results.orphanedPreferences = deletePrefsResult.deletedCount || 0
      }

      // Find orphaned sessions (sessions without users)
      const orphanedSessions = await db.collection('sessions').find({
        userId: { $nin: userObjectIds }
      }).toArray()

      if (orphanedSessions.length > 0) {
        const deleteSessionsResult = await db.collection('sessions').deleteMany({
          userId: { $nin: userObjectIds }
        })
        results.orphanedSessions = deleteSessionsResult.deletedCount || 0
      }

      return NextResponse.json({
        success: true,
        message: 'Cleanup completed',
        results
      })
    }

    if (action === 'reset-all-preferences') {
      const { confirm } = body

      if (confirm !== 'RESET_ALL_PREFERENCES') {
        return NextResponse.json({
          success: false,
          error: 'Confirmation required. Send { "confirm": "RESET_ALL_PREFERENCES" }'
        }, { status: 400 })
      }

      // Get all users with their spotify IDs
      const users = await db.collection('users').find({}).toArray()
      const accounts = await db.collection('accounts').find({ provider: 'spotify' }).toArray()

      const resetCount = await Promise.all(users.map(async (user) => {
        const spotifyAccount = accounts.find(acc => acc.userId.toString() === user._id.toString())
        const spotifyId = spotifyAccount?.providerAccountId || 'unknown'

        const defaultPreferences = {
          userId: user._id.toString(),
          spotifyId,
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
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const result = await db.collection('preferences').replaceOne(
          { userId: user._id.toString() },
          defaultPreferences,
          { upsert: true }
        )

        return result.modifiedCount || result.upsertedCount
      }))

      const totalReset = resetCount.reduce((sum, count) => sum + count, 0)

      return NextResponse.json({
        success: true,
        message: `Reset preferences for ${totalReset} users`,
        result: totalReset
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: cleanup-orphaned, reset-all-preferences'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Admin - System maintenance error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to perform maintenance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
