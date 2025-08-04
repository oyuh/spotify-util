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

    // Delete user data from MongoDB
    await deleteUser(userId)

    return NextResponse.json({
      success: true,
      message: 'Account data deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting account data:', error)
    return NextResponse.json(
      { error: 'Failed to delete account data' },
      { status: 500 }
    )
  }
}
