import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findAndFixDuplicateUsers } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Add admin check here if needed
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('🔧 Starting duplicate user cleanup...')

    const result = await findAndFixDuplicateUsers()

    return NextResponse.json({
      success: true,
      message: 'Duplicate user cleanup completed',
      duplicatesFound: result.duplicatesFound,
      duplicatesFixed: result.duplicatesFixed,
      errors: result.errors
    })

  } catch (error) {
    console.error('Error fixing duplicate users:', error)
    return NextResponse.json(
      { error: 'Failed to fix duplicate users' },
      { status: 500 }
    )
  }
}
