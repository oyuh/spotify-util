import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { migrateRemoveStreamerMode } from '@/lib/migration'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin (you may want to add admin check)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optional: Add admin check here
    // if (!session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    // }

    console.log('Running streamerMode migration...')
    const result = await migrateRemoveStreamerMode()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Migration completed successfully. ${result.migratedCount} users updated.`,
        details: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Migration failed',
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// For safety, only allow POST requests
export async function GET() {
  return NextResponse.json({
    message: 'Migration endpoint. Use POST to run migration.',
    warning: 'This will modify the database. Make sure you have backups.'
  })
}
