import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { identifier, type } = await request.json()

    if (!identifier || !type) {
      return NextResponse.json({ error: 'Missing identifier or type' }, { status: 400 })
    }

    const db = await getDatabase()
    const viewsCollection = db.collection('page_views')

    // Get IP address and user agent for rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('remote-addr') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create a unique session identifier based on IP + User Agent
    const sessionId = Buffer.from(`${clientIP}_${userAgent}`).toString('base64').slice(0, 20)

    console.log(`📊 View tracking for ${identifier}: IP=${clientIP}, Session=${sessionId}`)

    // Check if this session has already viewed this page in the last 5 minutes (strict rate limiting)
    const recentView = await viewsCollection.findOne({
      identifier,
      type,
      sessionId,
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    })

    let viewRecorded = false

    // Only record if it's a new view from this session
    if (!recentView) {
      await viewsCollection.insertOne({
        identifier,
        type,
        timestamp: new Date(),
        ip: clientIP,
        userAgent,
        sessionId
      })
      viewRecorded = true
      console.log(`✅ New view recorded for ${identifier}`)
    } else {
      console.log(`⏭️ Duplicate view blocked for ${identifier} (recent view found)`)
    }

    // Get current view count for this identifier (last 30 days)
    const viewCount = await viewsCollection.countDocuments({
      identifier,
      type,
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    })

    // Get active viewers (last 5 minutes)
    const activeViewers = await viewsCollection.distinct('sessionId', {
      identifier,
      type,
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    })

    console.log(`📈 Stats for ${identifier}: ${viewCount} total views, ${activeViewers.length} active viewers`)

    return NextResponse.json({
      success: true,
      viewCount,
      activeViewers: activeViewers.length,
      viewRecorded
    })
  } catch (error) {
    console.error('Error recording view:', error)
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')
    const type = searchParams.get('type') || 'display'

    if (!identifier) {
      return NextResponse.json({ error: 'Missing identifier' }, { status: 400 })
    }

    const db = await getDatabase()
    const viewsCollection = db.collection('page_views')

    // Get view count for last 30 days
    const viewCount = await viewsCollection.countDocuments({
      identifier,
      type,
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    })

    // Get real-time active viewers using distinct sessionIds (last 5 minutes)
    const activeViewers = await viewsCollection.distinct('sessionId', {
      identifier,
      type,
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    })

    return NextResponse.json({
      viewCount,
      activeViewers: activeViewers.length
    })
  } catch (error) {
    console.error('Error getting view count:', error)
    return NextResponse.json({ error: 'Failed to get view count' }, { status: 500 })
  }
}
