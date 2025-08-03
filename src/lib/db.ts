import { MongoClient, Db, Collection } from "mongodb"

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
  const options = {}

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
  displaySettings: {
    theme: string
    customCSS?: string
    streamerMode: boolean
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
  return client.db("test") // Use the same database where accounts are stored
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")
  return await collection.findOne({ userId })
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
  const db = await getDatabase()
  const collection: Collection<UserPreferences> = db.collection("user_preferences")

  console.log("DB - updateUserPreferences called with:", { userId, preferences: JSON.stringify(preferences, null, 2) })

  // Remove _id from preferences if it exists to avoid the immutable field error
  const { _id, ...preferencesWithoutId } = preferences as any

  const result = await collection.updateOne(
    { userId },
    {
      $set: {
        ...preferencesWithoutId,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  )

  console.log("DB - updateUserPreferences result:", {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
    upsertedId: result.upsertedId
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

  const defaultPreferences: UserPreferences = {
    userId,
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
      isPublic: false,
      hideSpotifyId: true,
    },
    displaySettings: {
      theme: "default",
      streamerMode: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await collection.updateOne(
    { userId },
    { $setOnInsert: defaultPreferences },
    { upsert: true }
  )
}
