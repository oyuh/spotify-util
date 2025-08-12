import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getDatabase,
  findAndFixDuplicateUsers,
  validateUserAccountLinking,
  deleteUser,
  getUserPreferences
} from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const db = await getDatabase()
    const results: any = {
      databaseName: db.databaseName,
      timestamp: new Date().toISOString(),
      tests: {}
    }

    // Test 1: Database Connection and Name
    results.tests.databaseConnection = {
      success: true,
      databaseName: db.databaseName,
      message: `Connected to database: ${db.databaseName}`
    }

    // Test 2: Check Collections Exist
    try {
      const collections = await db.listCollections().toArray()
      const collectionNames = collections.map(col => col.name)

      const expectedCollections = ['accounts', 'users', 'sessions', 'user_preferences']
      const missingCollections = expectedCollections.filter(expected =>
        !collectionNames.includes(expected)
      )

      results.tests.collections = {
        success: missingCollections.length === 0,
        found: collectionNames,
        missing: missingCollections,
        message: missingCollections.length === 0
          ? 'All expected collections found'
          : `Missing collections: ${missingCollections.join(', ')}`
      }
    } catch (error) {
      results.tests.collections = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 3: Count Documents in Each Collection
    try {
      const userPrefsCount = await db.collection("user_preferences").countDocuments()
      const accountsCount = await db.collection("accounts").countDocuments()
      const usersCount = await db.collection("users").countDocuments()
      const sessionsCount = await db.collection("sessions").countDocuments()

      results.tests.documentCounts = {
        success: true,
        counts: {
          user_preferences: userPrefsCount,
          accounts: accountsCount,
          users: usersCount,
          sessions: sessionsCount
        }
      }
    } catch (error) {
      results.tests.documentCounts = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 4: Check for Duplicate Users
    try {
      const duplicateCheck = await findAndFixDuplicateUsers()
      results.tests.duplicateUsers = {
        success: true,
        duplicatesFound: duplicateCheck.duplicatesFound,
        duplicatesFixed: duplicateCheck.duplicatesFixed,
        errors: duplicateCheck.errors,
        message: duplicateCheck.duplicatesFound === 0
          ? 'No duplicate users found'
          : `Found ${duplicateCheck.duplicatesFound} duplicate(s), fixed ${duplicateCheck.duplicatesFixed}`
      }
    } catch (error) {
      results.tests.duplicateUsers = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 5: Check User Account Linking
    try {
      const linkingCheck = await validateUserAccountLinking()
      results.tests.userAccountLinking = {
        success: linkingCheck.errors.length === 0,
        orphanedAccounts: linkingCheck.orphanedAccounts,
        orphanedPreferences: linkingCheck.orphanedPreferences,
        mislinkedAccounts: linkingCheck.mislinkedAccounts,
        fixed: linkingCheck.fixed,
        errors: linkingCheck.errors,
        message: linkingCheck.errors.length === 0
          ? 'User account linking is healthy'
          : `Found ${linkingCheck.errors.length} linking issue(s)`
      }
    } catch (error) {
      results.tests.userAccountLinking = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 6: Verify Current User Data
    try {
      const userPrefs = await getUserPreferences(session.userId)
      results.tests.currentUser = {
        success: userPrefs !== null,
        userId: session.userId,
        spotifyId: userPrefs?.spotifyId,
        hasPreferences: userPrefs !== null,
        message: userPrefs
          ? `User data found for ${session.userId} (Spotify: ${userPrefs.spotifyId})`
          : 'No user preferences found for current user'
      }
    } catch (error) {
      results.tests.currentUser = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Overall health score
    const successfulTests = Object.values(results.tests).filter((test: any) => test.success).length
    const totalTests = Object.keys(results.tests).length
    results.healthScore = {
      score: `${successfulTests}/${totalTests}`,
      percentage: Math.round((successfulTests / totalTests) * 100),
      status: successfulTests === totalTests ? 'HEALTHY' : 'NEEDS_ATTENTION'
    }

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Error running comprehensive database test:', error)
    return NextResponse.json(
      {
        error: 'Failed to run comprehensive database test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
