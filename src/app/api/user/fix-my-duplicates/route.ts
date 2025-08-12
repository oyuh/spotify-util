import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId || !session?.spotifyId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const db = await getDatabase()

    console.log('🔧 Fixing duplicates for user:', session.userId, 'Spotify:', session.spotifyId)

    // Find all user preferences for this Spotify ID
    const duplicates = await db.collection("user_preferences").find({
      spotifyId: session.spotifyId
    }).sort({ createdAt: 1 }).toArray() // Sort by creation date

    if (duplicates.length <= 1) {
      return NextResponse.json({
        success: true,
        message: 'No duplicates found',
        duplicateCount: duplicates.length
      })
    }

    console.log(`Found ${duplicates.length} duplicates:`, duplicates.map(d => ({
      id: d._id.toString(),
      userId: d.userId,
      slug: d.privacySettings?.customSlug,
      createdAt: d.createdAt
    })))

    // Find the one with the correct userId (should be "lawsonhart" in your case)
    const correctRecord = duplicates.find(d => d.userId === session.userId)
    const incorrectRecords = duplicates.filter(d => d.userId !== session.userId)

    if (!correctRecord) {
      return NextResponse.json({
        error: 'Could not find record with correct userId',
        found: duplicates.map(d => ({ userId: d.userId, id: d._id.toString() }))
      }, { status: 400 })
    }

    // If the correct record doesn't have a slug, copy it from one of the incorrect ones
    let updatedCorrectRecord = false
    if (!correctRecord.privacySettings?.customSlug) {
      const recordWithSlug = incorrectRecords.find(d => d.privacySettings?.customSlug)
      if (recordWithSlug) {
        console.log(`Copying slug "${recordWithSlug.privacySettings.customSlug}" to correct record`)

        await db.collection("user_preferences").updateOne(
          { _id: correctRecord._id },
          {
            $set: {
              'privacySettings.customSlug': recordWithSlug.privacySettings.customSlug,
              updatedAt: new Date()
            }
          }
        )
        updatedCorrectRecord = true
      }
    }

    // Delete the incorrect records
    const deleteResults = []
    for (const incorrectRecord of incorrectRecords) {
      const result = await db.collection("user_preferences").deleteOne({
        _id: incorrectRecord._id
      })
      deleteResults.push({
        id: incorrectRecord._id.toString(),
        userId: incorrectRecord.userId,
        deleted: result.deletedCount > 0
      })
      console.log(`Deleted incorrect record:`, incorrectRecord._id.toString())
    }

    // Verify the fix worked
    const remainingRecords = await db.collection("user_preferences").find({
      spotifyId: session.spotifyId
    }).toArray()

    return NextResponse.json({
      success: true,
      message: 'Successfully fixed duplicates',
      before: {
        duplicateCount: duplicates.length,
        records: duplicates.map(d => ({
          id: d._id.toString(),
          userId: d.userId,
          slug: d.privacySettings?.customSlug
        }))
      },
      actions: {
        keptRecord: {
          id: correctRecord._id.toString(),
          userId: correctRecord.userId,
          slug: correctRecord.privacySettings?.customSlug,
          updatedSlug: updatedCorrectRecord
        },
        deletedRecords: deleteResults
      },
      after: {
        remainingCount: remainingRecords.length,
        record: remainingRecords[0] ? {
          id: remainingRecords[0]._id.toString(),
          userId: remainingRecords[0].userId,
          slug: remainingRecords[0].privacySettings?.customSlug
        } : null
      }
    })

  } catch (error) {
    console.error('Error fixing duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to fix duplicates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
