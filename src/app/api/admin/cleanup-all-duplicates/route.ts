import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    console.log('🔧 Starting comprehensive duplicate prevention and cleanup...')

    const results: {
      duplicatesFound: number
      duplicatesRemoved: number
      usersFixed: Array<{
        spotifyId: string
        keptRecord: string
        deletedCount: number
      }>
      errors: string[]
    } = {
      duplicatesFound: 0,
      duplicatesRemoved: 0,
      usersFixed: [],
      errors: []
    }

    // Find all users with multiple preferences (grouped by spotifyId)
    const duplicateGroups = await db.collection("user_preferences").aggregate([
      {
        $group: {
          _id: "$spotifyId",
          count: { $sum: 1 },
          preferences: {
            $push: {
              id: "$_id",
              userId: "$userId",
              spotifyId: "$spotifyId",
              createdAt: "$createdAt",
              customSlug: "$privacySettings.customSlug",
              isValidUserId: { $not: { $regexMatch: { input: "$userId", regex: "^[0-9a-fA-F]{24}$" } } }
            }
          }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray()

    results.duplicatesFound = duplicateGroups.length

    for (const group of duplicateGroups) {
      const spotifyId = group._id
      const preferences = group.preferences.sort((a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      console.log(`\n🔍 Processing duplicates for Spotify ID: ${spotifyId}`)
      console.log(`Found ${preferences.length} preferences:`, preferences.map((p: any) => ({
        userId: p.userId,
        slug: p.customSlug,
        isValidUserId: p.isValidUserId,
        created: p.createdAt
      })))

      try {
        // Find the "best" record to keep
        // Priority: 1. Valid userId (not ObjectId), 2. Oldest record
        let recordToKeep = preferences.find((p: any) => p.isValidUserId) || preferences[0]
        const recordsToDelete = preferences.filter((p: any) => p.id.toString() !== recordToKeep.id.toString())

        console.log(`Keeping record: ${recordToKeep.userId} (${recordToKeep.id})`)
        console.log(`Deleting ${recordsToDelete.length} duplicates`)

        // If the record to keep doesn't have a custom slug, get one from the duplicates
        if (!recordToKeep.customSlug) {
          const recordWithSlug = recordsToDelete.find((p: any) => p.customSlug)
          if (recordWithSlug) {
            console.log(`Copying slug "${recordWithSlug.customSlug}" to kept record`)
            await db.collection("user_preferences").updateOne(
              { _id: new ObjectId(recordToKeep.id) },
              {
                $set: {
                  'privacySettings.customSlug': recordWithSlug.customSlug,
                  updatedAt: new Date()
                }
              }
            )
          }
        }

        // Delete the duplicate records
        for (const duplicate of recordsToDelete) {
          await db.collection("user_preferences").deleteOne({
            _id: new ObjectId(duplicate.id)
          })
          results.duplicatesRemoved++
        }

        results.usersFixed.push({
          spotifyId,
          keptRecord: recordToKeep.userId,
          deletedCount: recordsToDelete.length
        })

      } catch (error) {
        const errorMsg = `Failed to process duplicates for ${spotifyId}: ${error}`
        console.error(errorMsg)
        results.errors.push(errorMsg)
      }
    }

    console.log('✅ Duplicate cleanup completed:', results)

    return NextResponse.json({
      success: true,
      message: 'Duplicate cleanup completed successfully',
      results
    })

  } catch (error) {
    console.error('Error in duplicate cleanup:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup duplicates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
