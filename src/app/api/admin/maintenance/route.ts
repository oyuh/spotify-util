import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, findAndFixDuplicateUsers, validateUserAccountLinking } from '@/lib/db'
import { ObjectId } from 'mongodb'

interface MaintenanceTask {
  name: string
  description: string
  execute: () => Promise<any>
}

// Verify request is from a valid source (you can enhance this with API keys, etc.)
function isAuthorizedRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here'

  // For now, just check for the secret key
  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: NextRequest) {
  try {
    // Uncomment this for production to require authorization
    // if (!isAuthorizedRequest(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { taskName } = await request.json().catch(() => ({}))

    const db = await getDatabase()
    const results: any = {
      timestamp: new Date().toISOString(),
      tasksExecuted: [],
      errors: []
    }

    const maintenanceTasks: MaintenanceTask[] = [
      {
        name: 'cleanup-duplicates',
        description: 'Find and remove duplicate user accounts',
        execute: async () => {
          const result = await findAndFixDuplicateUsers()
          return {
            duplicatesFound: result.duplicatesFound,
            duplicatesFixed: result.duplicatesFixed,
            errors: result.errors
          }
        }
      },
      {
        name: 'validate-linking',
        description: 'Validate user-account linking and fix issues',
        execute: async () => {
          const result = await validateUserAccountLinking()
          return {
            orphanedAccounts: result.orphanedAccounts,
            orphanedPreferences: result.orphanedPreferences,
            mislinkedAccounts: result.mislinkedAccounts,
            fixed: result.fixed,
            errors: result.errors
          }
        }
      },
      {
        name: 'cleanup-old-sessions',
        description: 'Remove expired sessions older than 30 days',
        execute: async () => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const result = await db.collection('sessions').deleteMany({
            expires: { $lt: thirtyDaysAgo }
          })

          return {
            deletedSessions: result.deletedCount,
            cutoffDate: thirtyDaysAgo.toISOString()
          }
        }
      },
      {
        name: 'cleanup-orphaned-tokens',
        description: 'Remove verification tokens older than 24 hours',
        execute: async () => {
          const twentyFourHoursAgo = new Date()
          twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

          const result = await db.collection('verification_tokens').deleteMany({
            expires: { $lt: twentyFourHoursAgo }
          })

          return {
            deletedTokens: result.deletedCount,
            cutoffDate: twentyFourHoursAgo.toISOString()
          }
        }
      },
      {
        name: 'fix-malformed-userids',
        description: 'Fix user preferences with malformed userIds',
        execute: async () => {
          // Find user preferences where userId is an ObjectId string but should be linked to actual user
          const malformedPrefs = await db.collection('user_preferences').find({
            userId: { $regex: /^[0-9a-fA-F]{24}$/ } // ObjectId pattern
          }).toArray()

          let fixed = 0
          const errors: string[] = []

          for (const pref of malformedPrefs) {
            try {
              // Try to find the real account for this Spotify ID
              const account = await db.collection('accounts').findOne({
                providerAccountId: pref.spotifyId,
                provider: 'spotify'
              })

              if (account && account.userId !== pref.userId) {
                // Update the preference to use the correct userId
                await db.collection('user_preferences').updateOne(
                  { _id: pref._id },
                  { $set: { userId: account.userId.toString(), updatedAt: new Date() } }
                )
                fixed++
              }
            } catch (error) {
              errors.push(`Failed to fix preference ${pref._id}: ${error}`)
            }
          }

          return {
            malformedFound: malformedPrefs.length,
            fixed,
            errors
          }
        }
      },
      {
        name: 'database-stats',
        description: 'Generate database statistics',
        execute: async () => {
          const collections = await db.listCollections().toArray()
          const stats: Record<string, number> = {}

          for (const collection of collections) {
            stats[collection.name] = await db.collection(collection.name).countDocuments()
          }

          return {
            collections: stats,
            totalCollections: collections.length,
            totalDocuments: Object.values(stats).reduce((sum, count) => sum + count, 0)
          }
        }
      }
    ]

    // If specific task is requested, run only that one
    if (taskName) {
      const task = maintenanceTasks.find(t => t.name === taskName)
      if (!task) {
        return NextResponse.json({ error: `Task '${taskName}' not found` }, { status: 400 })
      }

      try {
        const taskResult = await task.execute()
        results.tasksExecuted.push({
          name: task.name,
          description: task.description,
          result: taskResult,
          success: true
        })
      } catch (error) {
        results.errors.push(`${task.name}: ${error}`)
        results.tasksExecuted.push({
          name: task.name,
          description: task.description,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    } else {
      // Run all maintenance tasks
      for (const task of maintenanceTasks) {
        try {
          console.log(`🔧 Running maintenance task: ${task.name}`)
          const taskResult = await task.execute()
          results.tasksExecuted.push({
            name: task.name,
            description: task.description,
            result: taskResult,
            success: true
          })
          console.log(`✅ Completed: ${task.name}`)
        } catch (error) {
          console.error(`❌ Failed: ${task.name}`, error)
          results.errors.push(`${task.name}: ${error}`)
          results.tasksExecuted.push({
            name: task.name,
            description: task.description,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    // Save maintenance log
    try {
      await db.collection('maintenance_logs').insertOne({
        timestamp: new Date(),
        results,
        requestedTask: taskName || 'all'
      })
    } catch (error) {
      console.error('Failed to save maintenance log:', error)
    }

    return NextResponse.json({
      success: true,
      message: `Maintenance completed. Executed ${results.tasksExecuted.length} tasks.`,
      results,
      availableTasks: maintenanceTasks.map(t => ({ name: t.name, description: t.description }))
    })

  } catch (error) {
    console.error('Error running maintenance:', error)
    return NextResponse.json(
      { error: 'Failed to run maintenance tasks' },
      { status: 500 }
    )
  }
}

// GET endpoint to list available tasks
export async function GET() {
  const maintenanceTasks = [
    { name: 'cleanup-duplicates', description: 'Find and remove duplicate user accounts' },
    { name: 'validate-linking', description: 'Validate user-account linking and fix issues' },
    { name: 'cleanup-old-sessions', description: 'Remove expired sessions older than 30 days' },
    { name: 'cleanup-orphaned-tokens', description: 'Remove verification tokens older than 24 hours' },
    { name: 'fix-malformed-userids', description: 'Fix user preferences with malformed userIds' },
    { name: 'database-stats', description: 'Generate database statistics' }
  ]

  return NextResponse.json({
    success: true,
    availableTasks: maintenanceTasks,
    usage: {
      runAll: 'POST /api/admin/maintenance',
      runSpecific: 'POST /api/admin/maintenance with body: {"taskName": "cleanup-duplicates"}'
    }
  })
}
