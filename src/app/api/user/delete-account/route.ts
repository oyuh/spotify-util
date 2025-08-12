import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPreferences, deleteUser } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = session.userId

    // Get current user preferences to verify user exists
    const userPrefs = await getUserPreferences(userId)
    if (!userPrefs) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log(`🗑️ User ${userId} (Spotify: ${userPrefs.spotifyId}) requested account deletion`)

    // Delete user data from MongoDB - this now does comprehensive deletion
    await deleteUser(userId)

    return NextResponse.json({
      success: true,
      message: 'All account data has been permanently deleted',
      deletedUserId: userId,
      deletedSpotifyId: userPrefs.spotifyId
    })

  } catch (error) {
    console.error('Error deleting account data:', error)
    return NextResponse.json(
      { error: 'Failed to delete account data' },
      { status: 500 }
    )
  }
}
