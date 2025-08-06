import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

// DEV ONLY: List all users with their details
export async function GET(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const db = await getDatabase()

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'preferences.privacySettings.customSlug': { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count
    const total = await db.collection('users').countDocuments(query)

    // Get users with pagination
    const users = await db.collection('users')
      .find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Also get accounts for each user
    const userIds = users.map((user: any) => user._id)
    const accounts = await db.collection('accounts')
      .find({ userId: { $in: userIds } })
      .toArray()

    // Create account mapping
    const accountMap = new Map()
    accounts.forEach((account: any) => {
      if (!accountMap.has(account.userId.toString())) {
        accountMap.set(account.userId.toString(), [])
      }
      accountMap.get(account.userId.toString()).push(account)
    })

    // Enhance users with account info
    const enhancedUsers = users.map((user: any) => ({
      id: user._id.toString(), // Convert MongoDB _id to string id
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      isActive: user.isActive !== false, // Default to true if not set
      isLocked: user.isLocked === true, // Default to false if not set
      accounts: accountMap.get(user._id.toString()) || [],
      accountCount: (accountMap.get(user._id.toString()) || []).length,
      hasSpotifyAccount: (accountMap.get(user._id.toString()) || []).some((acc: any) => acc.provider === 'spotify'),
      spotifyId: (accountMap.get(user._id.toString()) || []).find((acc: any) => acc.provider === 'spotify')?.providerAccountId,
      accountProvider: (accountMap.get(user._id.toString()) || [])[0]?.provider,
      hasPreferences: true, // We'll update this if needed
      lastLoginDate: user.lastLoginDate || 'Never'
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: enhancedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('❌ Admin - List users error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to list users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
