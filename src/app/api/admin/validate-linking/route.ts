import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateUserAccountLinking } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Add admin check here if needed
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('🔗 Starting user account linking validation...')

    const result = await validateUserAccountLinking()

    return NextResponse.json({
      success: true,
      message: 'User account linking validation completed',
      orphanedAccounts: result.orphanedAccounts,
      orphanedPreferences: result.orphanedPreferences,
      mislinkedAccounts: result.mislinkedAccounts,
      fixed: result.fixed,
      errors: result.errors
    })

  } catch (error) {
    console.error('Error validating user account linking:', error)
    return NextResponse.json(
      { error: 'Failed to validate user account linking' },
      { status: 500 }
    )
  }
}
