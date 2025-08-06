import { getDatabase, UserPreferences } from '@/lib/db'

/**
 * Migration to remove streamerMode from user preferences
 * This should be run once after deploying the changes
 */
export async function migrateRemoveStreamerMode() {
  try {
    const db = await getDatabase()
    const users = db.collection<UserPreferences>('users')

    // Find all users that have streamerMode in their displaySettings
    const usersWithStreamerMode = await users.find({
      'displaySettings.streamerMode': { $exists: true }
    }).toArray()

    console.log(`Found ${usersWithStreamerMode.length} users with streamerMode to migrate`)

    if (usersWithStreamerMode.length === 0) {
      console.log('No users to migrate')
      return { success: true, migratedCount: 0 }
    }

    // Remove streamerMode from all users
    const result = await users.updateMany(
      { 'displaySettings.streamerMode': { $exists: true } },
      {
        $unset: { 'displaySettings.streamerMode': '' },
        $set: { updatedAt: new Date() }
      }
    )

    console.log(`Migration completed. Updated ${result.modifiedCount} users`)

    return {
      success: true,
      migratedCount: result.modifiedCount,
      foundUsers: usersWithStreamerMode.length
    }
  } catch (error) {
    console.error('Migration failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * API route handler for the migration
 */
export async function runMigration() {
  console.log('Starting streamerMode removal migration...')
  const result = await migrateRemoveStreamerMode()
  console.log('Migration result:', result)
  return result
}
