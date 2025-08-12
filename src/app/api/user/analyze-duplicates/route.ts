import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const db = await getDatabase()

    // Find all user preferences for this user's Spotify ID
    const userPrefs = await db.collection("user_preferences").find({
      spotifyId: session.spotifyId
    }).toArray()

    // Also check for any preferences with this userId
    const userPrefsById = await db.collection("user_preferences").find({
      userId: session.userId
    }).toArray()

    // Combine and deduplicate
    const allUserPrefs = [...userPrefs, ...userPrefsById].reduce((acc, current) => {
      const existing = acc.find(item => item._id.toString() === current._id.toString())
      if (!existing) {
        acc.push(current)
      }
      return acc
    }, [] as any[])

    // Get account information
    const account = await db.collection("accounts").findOne({
      userId: session.userId
    })

    return NextResponse.json({
      success: true,
      currentSession: {
        userId: session.userId,
        spotifyId: session.spotifyId
      },
      account: account ? {
        userId: account.userId,
        providerAccountId: account.providerAccountId,
        provider: account.provider
      } : null,
      userPreferences: allUserPrefs.map(pref => ({
        _id: pref._id.toString(),
        userId: pref.userId,
        spotifyId: pref.spotifyId,
        createdAt: pref.createdAt,
        updatedAt: pref.updatedAt,
        isCurrentUser: pref.userId === session.userId,
        hasValidUserId: pref.userId && !ObjectId.isValid(pref.userId),
        slug: pref.privacySettings?.customSlug
      })),
      duplicateCount: allUserPrefs.length,
      recommendation: allUserPrefs.length > 1 ? {
        message: "Multiple user preferences found. Recommend keeping the one with matching userId or the oldest one.",
        keepThis: allUserPrefs.find(p => p.userId === session.userId) ||
                 allUserPrefs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
      } : null
    })

  } catch (error) {
    console.error('Error analyzing user duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to analyze user duplicates' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { preferenceIdToDelete } = await request.json()

    if (!preferenceIdToDelete) {
      return NextResponse.json({ error: 'Must specify preferenceIdToDelete' }, { status: 400 })
    }

    const db = await getDatabase()

    // Verify the preference belongs to this user
    const preferenceToDelete = await db.collection("user_preferences").findOne({
      _id: new ObjectId(preferenceIdToDelete)
    })

    if (!preferenceToDelete) {
      return NextResponse.json({ error: 'Preference not found' }, { status: 404 })
    }

    // Security check - make sure it's the user's data
    if (preferenceToDelete.spotifyId !== session.spotifyId) {
      return NextResponse.json({ error: 'Not authorized to delete this preference' }, { status: 403 })
    }

    // Delete the specific duplicate
    const result = await db.collection("user_preferences").deleteOne({
      _id: new ObjectId(preferenceIdToDelete)
    })

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
      deletedId: preferenceIdToDelete,
      message: `Successfully deleted duplicate user preference`
    })

  } catch (error) {
    console.error('Error deleting duplicate user preference:', error)
    return NextResponse.json(
      { error: 'Failed to delete duplicate user preference' },
      { status: 500 }
    )
  }
}
