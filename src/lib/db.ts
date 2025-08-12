import { MongoClient, Db, Collection, ObjectId } from "mongodb"

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

// Lazy initialization to avoid build-time env var requirements
let client: MongoClient
let clientPromise: Promise<MongoClient>

function initializeClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  const uri = process.env.MONGODB_URI
  const options = {
    // Basic connection options for serverless environments
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
    w: 'majority' as const
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default function getClientPromise() {
  if (!clientPromise) {
    clientPromise = initializeClient()
  }
  return clientPromise
}

// Database collections interfaces
export interface UserPreferences {
  userId: string
  spotifyId: string
  publicDisplaySettings: {
    showCurrentTrack: boolean
    showRecentTracks: boolean
    showArtist: boolean
    showAlbum: boolean
    showDuration: boolean
    showProgress: boolean
    showCredits: boolean
    numberOfRecentTracks: number
  }
  privacySettings: {
    isPublic: boolean
    customSlug?: string
    hideSpotifyId: boolean
  }
  // App-wide theme settings (private to user)
  appSettings: {
    theme: string // App theme ID (dark, light, spotify-dark, etc.)
  }
  // Display style settings (public, visible to visitors)
  displaySettings: {
    style: string // Display style ID (minimal, spotify-classic, neon-purple, etc.)
    customCSS?: string
    backgroundImage?: string // URL to custom background image
    position?: {
      x: number
      y: number
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  userId: string
  spotifyId: string
  accessToken: string
  refreshToken: string
  expiresAt: number
  lastActivity: Date
}

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const clientPromise = getClientPromise()
  const client = await clientPromise
  return client.db("spotify-util") // Use the spotify-util database consistently
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  console.log(`Looking for user preferences with userId: ${userId}`)

  // Try to find by userId first
  let userPrefs = await collection.findOne({ userId })

  if (!userPrefs) {
    console.log(`No preferences found with userId ${userId}, trying to find by spotifyId`)
    // If not found by userId, try to find by spotifyId (in case userId is actually spotifyId)
    userPrefs = await collection.findOne({ spotifyId: userId })
  }

  if (userPrefs) {
    console.log(`Found user preferences: ${userPrefs._id}`)
  } else {
    console.log(`No user preferences found for: ${userId}`)
  }

  return userPrefs
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  console.log("DB - updateUserPreferences called with:", { userId, preferences: JSON.stringify(preferences, null, 2) })

  // Remove _id from preferences if it exists to avoid the immutable field error
  const { _id, ...preferencesWithoutId } = preferences as any

  // First, try to find existing user preferences by userId or spotifyId
  let existingPrefs = await collection.findOne({ userId })
  if (!existingPrefs) {
    console.log(`No preferences found with userId ${userId}, trying spotifyId`)
    existingPrefs = await collection.findOne({ spotifyId: userId })
  }

  let result
  if (existingPrefs) {
    console.log(`Updating existing preferences: ${existingPrefs._id}`)
    // Update the existing record using its _id to ensure we update the right one
    result = await collection.updateOne(
      { _id: existingPrefs._id },
      {
        $set: {
          ...preferencesWithoutId,
          userId: userId, // Ensure userId is consistent
          updatedAt: new Date(),
        },
      }
    )
  } else {
    console.log(`No existing preferences found, creating new one for userId: ${userId}`)
    // Create new record - this should rarely happen since they're created on sign-in
    result = await collection.insertOne({
      userId,
      ...preferencesWithoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserPreferences)
  }

  console.log("DB - updateUserPreferences result:", {
    matchedCount: 'matchedCount' in result ? result.matchedCount : 0,
    modifiedCount: 'modifiedCount' in result ? result.modifiedCount : 0,
    insertedId: 'insertedId' in result ? result.insertedId : null
  })
}

export async function getUserBySlug(slug: string): Promise<UserPreferences | null> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")
  return await collection.findOne({ "privacySettings.customSlug": slug })
}

export async function getUserBySpotifyId(spotifyId: string): Promise<UserPreferences | null> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")
  return await collection.findOne({ spotifyId })
}

export async function createDefaultUserPreferences(userId: string, spotifyId: string): Promise<void> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  console.log(`Creating default preferences for userId: ${userId}, spotifyId: ${spotifyId}`)

  // CRITICAL FIX: Get the ACTUAL userId from the accounts table
  // The userId passed in might not be the final MongoDB ObjectId
  const accountsCollection = db.collection("accounts")
  const spotifyAccount = await accountsCollection.findOne({
    provider: "spotify",
    providerAccountId: spotifyId
  })

  let actualUserId = userId
  if (spotifyAccount && spotifyAccount.userId) {
    actualUserId = spotifyAccount.userId.toString()
    console.log(`Found actual userId from accounts table: ${actualUserId}`)

    if (actualUserId !== userId) {
      console.log(`WARNING: userId mismatch! Passed: ${userId}, Actual: ${actualUserId}`)
    }
  }

  // Check if preferences already exist using the ACTUAL userId
  const existingByActualUserId = await collection.findOne({ userId: actualUserId })
  if (existingByActualUserId) {
    console.log(`Preferences already exist for actual userId ${actualUserId}, updating if needed`)

    // Update to ensure both userId and spotifyId are correct
    await collection.updateOne(
      { _id: existingByActualUserId._id },
      {
        $set: {
          userId: actualUserId,
          spotifyId: spotifyId,
          updatedAt: new Date()
        }
      }
    )
    return
  }

  // Check if preferences exist with wrong userId (like spotifyId)
  const existingByWrongUserId = await collection.findOne({
    $or: [
      { userId: spotifyId }, // userId was set to spotifyId by mistake
      { spotifyId: actualUserId }, // spotifyId was set to userId by mistake
      { spotifyId: spotifyId, userId: { $ne: actualUserId } } // Right spotifyId but wrong userId
    ]
  })

  if (existingByWrongUserId) {
    console.log(`Found existing preferences with wrong userId, fixing it`)
    await collection.updateOne(
      { _id: existingByWrongUserId._id },
      {
        $set: {
          userId: actualUserId,
          spotifyId: spotifyId,
          updatedAt: new Date()
        }
      }
    )
    return
  }

  // Create new preferences with CORRECT userId
  const { generateCustomSlug } = await import("@/lib/utils")
  const defaultPreferences: UserPreferences = {
    userId: actualUserId, // Use the ACTUAL userId from accounts table
    spotifyId,
    publicDisplaySettings: {
      showCurrentTrack: true,
      showRecentTracks: false,
      showArtist: true,
      showAlbum: true,
      showDuration: false,
      showProgress: false,
      showCredits: false,
      numberOfRecentTracks: 5,
    },
    privacySettings: {
      isPublic: true,
      customSlug: generateCustomSlug(8),
      hideSpotifyId: true,
    },
    appSettings: {
      theme: "dark", // Default app theme
    },
    displaySettings: {
      style: "minimal", // Default display style
      // backgroundImage field will be undefined by default
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Insert the new preferences
  const insertResult = await collection.insertOne(defaultPreferences)
  console.log(`✅ Created new user preferences with correct userId ${actualUserId}, ID: ${insertResult.insertedId}`)
}

// Function to clean up duplicate user preferences for a user
export async function cleanupDuplicateUserPreferences(userId: string, spotifyId: string): Promise<void> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  console.log(`Cleaning up duplicate preferences for userId: ${userId}, spotifyId: ${spotifyId}`)

  // Find all user preferences that match either userId or spotifyId
  const allPrefs = await collection.find({
    $or: [
      { userId: userId },
      { spotifyId: spotifyId },
      { userId: spotifyId }, // In case userId was stored as spotifyId
      { spotifyId: userId }   // In case spotifyId was stored as userId
    ]
  }).toArray()

  console.log(`Found ${allPrefs.length} preference records to evaluate`)

  if (allPrefs.length <= 1) {
    console.log('No duplicates found, nothing to clean up')
    return
  }

  // Find the most complete record (the one with most fields and latest update)
  let bestRecord = allPrefs[0]
  for (const record of allPrefs) {
    // Score each record based on completeness and recency
    const recordScore = (
      (record.displaySettings ? 1 : 0) +
      (record.privacySettings ? 1 : 0) +
      (record.publicDisplaySettings ? 1 : 0) +
      (record.appSettings ? 1 : 0) +
      (record.updatedAt ? record.updatedAt.getTime() : 0) / 1000000000 // Weight recent updates
    )

    const bestScore = (
      (bestRecord.displaySettings ? 1 : 0) +
      (bestRecord.privacySettings ? 1 : 0) +
      (bestRecord.publicDisplaySettings ? 1 : 0) +
      (bestRecord.appSettings ? 1 : 0) +
      (bestRecord.updatedAt ? bestRecord.updatedAt.getTime() : 0) / 1000000000
    )

    if (recordScore > bestScore) {
      bestRecord = record
    }
  }

  console.log(`Best record found: ${bestRecord._id} with score calculation`)

  // Update the best record to ensure it has correct userId and spotifyId
  await collection.updateOne(
    { _id: bestRecord._id },
    {
      $set: {
        userId: userId,
        spotifyId: spotifyId,
        updatedAt: new Date()
      }
    }
  )

  // Delete all other records
  const recordsToDelete = allPrefs.filter(record => record._id?.toString() !== bestRecord._id?.toString())
  if (recordsToDelete.length > 0) {
    const idsToDelete = recordsToDelete.map(record => record._id)
    const deleteResult = await collection.deleteMany({ _id: { $in: idsToDelete } })
    console.log(`Deleted ${deleteResult.deletedCount} duplicate preference records`)
  }
}

export async function isSlugTaken(slug: string, excludeUserId?: string): Promise<boolean> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  const query: any = { "privacySettings.customSlug": slug }

  // If we're updating an existing user, exclude their current record
  if (excludeUserId) {
    query.userId = { $ne: excludeUserId }
  }

  const existingUser = await collection.findOne(query)
  return existingUser !== null
}

export async function deleteUser(userId: string): Promise<void> {
  const db = await getDatabase()

  console.log(`Starting comprehensive deletion for user: ${userId}`)

  try {
    // 1. Delete user preferences
    const userPrefsResult = await db.collection("user_preferences").deleteMany({
      $or: [
        { userId: userId },
        { userId: new ObjectId(userId) }
      ]
    })
    console.log(`Deleted ${userPrefsResult.deletedCount} user preference records`)

    // 2. Delete user accounts (OAuth data) - check both string and ObjectId formats
    const accountsResult = await db.collection("accounts").deleteMany({
      $or: [
        { userId: userId },
        { userId: new ObjectId(userId) }
      ]
    })
    console.log(`Deleted ${accountsResult.deletedCount} account records`)

    // 3. Delete user sessions - check both string and ObjectId formats
    const sessionsResult = await db.collection("sessions").deleteMany({
      $or: [
        { userId: userId },
        { userId: new ObjectId(userId) }
      ]
    })
    console.log(`Deleted ${sessionsResult.deletedCount} session records`)

    // 4. Delete user records from users collection (NextAuth creates this)
    const usersQuery: any = { $or: [] }

    // Try to convert to ObjectId if it's a valid format
    try {
      const userObjectId = new ObjectId(userId)
      usersQuery.$or.push({ _id: userObjectId })
    } catch {
      // If conversion fails, userId is not a valid ObjectId format
      console.log(`UserId ${userId} is not a valid ObjectId format`)
    }

    // Also try the string format just in case
    usersQuery.$or.push({ _id: userId })

    const usersResult = await db.collection("users").deleteMany(usersQuery)
    console.log(`Deleted ${usersResult.deletedCount} user records`)

    // 5. Delete any verification tokens associated with the user (if they exist)
    const verificationResult = await db.collection("verification_tokens").deleteMany({
      $or: [
        { userId: userId },
        { userId: new ObjectId(userId) }
      ]
    })
    console.log(`Deleted ${verificationResult.deletedCount} verification token records`)

    // 6. Check for any view tracking data or analytics data (if you have such collections)
    // This is precautionary in case you add analytics collections in the future
    const collections = await db.listCollections().toArray()
    const analyticsCollections = collections.filter(col =>
      col.name.includes('analytics') ||
      col.name.includes('views') ||
      col.name.includes('stats')
    )

    for (const collection of analyticsCollections) {
      const analyticsResult = await db.collection(collection.name).deleteMany({
        $or: [
          { userId: userId },
          { userId: new ObjectId(userId) }
        ]
      })
      if (analyticsResult.deletedCount > 0) {
        console.log(`Deleted ${analyticsResult.deletedCount} records from ${collection.name} collection`)
      }
    }

    const totalDeleted = userPrefsResult.deletedCount + accountsResult.deletedCount +
                        sessionsResult.deletedCount + usersResult.deletedCount +
                        verificationResult.deletedCount

    console.log(`✅ Comprehensive deletion completed for user ${userId}. Total records deleted: ${totalDeleted}`)

    if (totalDeleted === 0) {
      console.warn(`⚠️ No data found to delete for user ${userId}. User may not exist or data may be in different format.`)
    }

  } catch (error) {
    console.error(`❌ Error during user deletion for ${userId}:`, error)
    throw error
  }
}

// Helper function to check for duplicate users and fix them
export async function findAndFixDuplicateUsers(): Promise<{
  duplicatesFound: number;
  duplicatesFixed: number;
  errors: string[];
}> {
  const db = await getDatabase()
  const duplicatesFound: string[] = []
  const errors: string[] = []
  let duplicatesFixed = 0

  try {
    // Find duplicate user preferences by spotifyId
    const duplicateSpotifyIds = await db.collection("user_preferences").aggregate([
      {
        $group: {
          _id: "$spotifyId",
          count: { $sum: 1 },
          users: { $push: { userId: "$userId", createdAt: "$createdAt" } }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray()

    for (const duplicate of duplicateSpotifyIds) {
      duplicatesFound.push(duplicate._id)

      // Keep the oldest user (by createdAt) and delete the newer ones
      const users = duplicate.users.sort((a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      const userToKeep = users[0]
      const usersToDelete = users.slice(1)

      console.log(`Found duplicate users for Spotify ID ${duplicate._id}:`)
      console.log(`  Keeping user: ${userToKeep.userId} (created: ${userToKeep.createdAt})`)
      console.log(`  Deleting ${usersToDelete.length} duplicate(s)`)

      for (const userToDelete of usersToDelete) {
        try {
          await deleteUser(userToDelete.userId)
          duplicatesFixed++
        } catch (error) {
          errors.push(`Failed to delete duplicate user ${userToDelete.userId}: ${error}`)
        }
      }
    }

    return {
      duplicatesFound: duplicatesFound.length,
      duplicatesFixed,
      errors
    }
  } catch (error) {
    errors.push(`Error during duplicate user detection: ${error}`)
    return {
      duplicatesFound: 0,
      duplicatesFixed: 0,
      errors
    }
  }
}

// Function to ensure user account linking is correct
export async function validateUserAccountLinking(): Promise<{
  orphanedAccounts: number;
  orphanedPreferences: number;
  mislinkedAccounts: number;
  fixed: number;
  errors: string[];
}> {
  const db = await getDatabase()
  const errors: string[] = []
  let orphanedAccounts = 0
  let orphanedPreferences = 0
  let mislinkedAccounts = 0
  let fixed = 0

  try {
    // 1. Find accounts without corresponding user preferences
    const allAccounts = await db.collection("accounts").find({}).toArray()
    for (const account of allAccounts) {
      const userPrefs = await db.collection("user_preferences").findOne({
        $or: [
          { userId: account.userId },
          { userId: account.userId.toString() }
        ]
      })

      if (!userPrefs) {
        orphanedAccounts++
        console.log(`Found orphaned account: ${account.userId} (Spotify: ${account.providerAccountId})`)

        // Try to create missing user preferences
        try {
          await createDefaultUserPreferences(account.userId.toString(), account.providerAccountId)
          fixed++
        } catch (error) {
          errors.push(`Failed to create preferences for orphaned account ${account.userId}: ${error}`)
        }
      }
    }

    // 2. Find user preferences without corresponding accounts
    const allPreferences = await db.collection("user_preferences").find({}).toArray()
    for (const prefs of allPreferences) {
      const account = await db.collection("accounts").findOne({
        $or: [
          { userId: prefs.userId },
          { providerAccountId: prefs.spotifyId }
        ]
      })

      if (!account) {
        orphanedPreferences++
        console.log(`Found orphaned preferences: ${prefs.userId} (Spotify: ${prefs.spotifyId})`)
        // Note: We don't auto-delete these as they might be recoverable
      }
    }

    // 3. Find accounts with mismatched Spotify IDs
    for (const prefs of allPreferences) {
      const account = await db.collection("accounts").findOne({
        userId: prefs.userId
      })

      if (account && account.providerAccountId !== prefs.spotifyId) {
        mislinkedAccounts++
        console.log(`Found mislinked account: User ${prefs.userId} has Spotify ID ${prefs.spotifyId} in preferences but ${account.providerAccountId} in account`)

        // Fix by updating preferences to match account
        try {
          await db.collection("user_preferences").updateOne(
            { userId: prefs.userId },
            { $set: { spotifyId: account.providerAccountId, updatedAt: new Date() } }
          )
          fixed++
        } catch (error) {
          errors.push(`Failed to fix mislinked account ${prefs.userId}: ${error}`)
        }
      }
    }

    return {
      orphanedAccounts,
      orphanedPreferences,
      mislinkedAccounts,
      fixed,
      errors
    }
  } catch (error) {
    errors.push(`Error during validation: ${error}`)
    return {
      orphanedAccounts: 0,
      orphanedPreferences: 0,
      mislinkedAccounts: 0,
      fixed: 0,
      errors
    }
  }
}
