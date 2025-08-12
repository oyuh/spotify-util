import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const db = await getDatabase()

    // Get database name
    const databaseName = db.databaseName

    // List all collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(col => col.name).sort()

    // Count documents in each collection
    const collectionCounts: Record<string, number> = {}
    for (const collectionName of collectionNames) {
      try {
        const count = await db.collection(collectionName).countDocuments()
        collectionCounts[collectionName] = count
      } catch (error) {
        collectionCounts[collectionName] = -1 // Error counting
      }
    }

    // Check for specific user data
    const userPrefsCount = await db.collection("user_preferences").countDocuments()
    const accountsCount = await db.collection("accounts").countDocuments()
    const usersCount = await db.collection("users").countDocuments()
    const sessionsCount = await db.collection("sessions").countDocuments()

    return NextResponse.json({
      success: true,
      database: {
        name: databaseName,
        collections: collectionNames,
        collectionCounts,
        summary: {
          userPreferences: userPrefsCount,
          accounts: accountsCount,
          users: usersCount,
          sessions: sessionsCount,
          totalCollections: collectionNames.length
        }
      }
    })

  } catch (error) {
    console.error('Error getting database diagnostic:', error)
    return NextResponse.json(
      { error: 'Failed to get database diagnostic' },
      { status: 500 }
    )
  }
}
