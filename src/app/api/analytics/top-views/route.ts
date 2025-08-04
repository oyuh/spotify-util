import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

async function getSpotifyData(accessToken: string, endpoint: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Spotify data:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log(`🏆 Leaderboard: Fetching top displays for last ${days} days, limit ${limit}`)

    const db = await getDatabase()
    const viewsCollection = db.collection('page_views')
    const userPreferencesCollection = db.collection('user_preferences')

    // Get all views first to debug
    const totalViews = await viewsCollection.countDocuments({
      type: 'display'
    })
    console.log(`🏆 Total display views in database: ${totalViews}`)

    // Get top viewed displays from last X days
    const topViews = await viewsCollection.aggregate([
      {
        $match: {
          type: 'display',
          timestamp: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$identifier',
          viewCount: { $sum: 1 },
          lastViewed: { $max: '$timestamp' }
        }
      },
      {
        $sort: { viewCount: -1 }
      },
      {
        $limit: limit
      }
    ]).toArray()

    console.log(`🏆 Raw top views:`, topViews)

    // Get user preferences for each identifier to check if they're public
    const enrichedViews = await Promise.all(
      topViews.map(async (view) => {
        try {
          // Try to find user preferences by slug first
          let userPrefs = await userPreferencesCollection.findOne({
            'privacySettings.customSlug': view._id
          })

          // If not found, try by Spotify ID
          if (!userPrefs) {
            userPrefs = await userPreferencesCollection.findOne({
              spotifyId: view._id
            })
          }

          console.log(`🏆 User prefs for ${view._id}:`, userPrefs?.privacySettings)

          // Get the last track played by this user from Spotify API
          let lastTrack = null
          if (userPrefs?.spotifyId) {
            try {
              // Get user's account to access their Spotify token
              const accountsCollection = db.collection('accounts')

              // Try finding account by spotifyId (providerAccountId)
              const account = await accountsCollection.findOne({
                providerAccountId: userPrefs.spotifyId,
                provider: 'spotify'
              })

              if (account?.access_token) {
                // Direct Spotify API call for recent tracks
                const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
                  headers: {
                    'Authorization': `Bearer ${account.access_token}`,
                    'Content-Type': 'application/json'
                  }
                })

                if (recentResponse.ok) {
                  const recentData = await recentResponse.json()
                  if (recentData.items && recentData.items.length > 0) {
                    const track = recentData.items[0].track
                    lastTrack = {
                      name: track.name,
                      artist: track.artists?.[0]?.name || 'Unknown Artist'
                    }
                    console.log(`� Found recent track for ${view._id}:`, lastTrack)
                  }
                } else {
                  console.log(`� Spotify API error for ${view._id}:`, recentResponse.status)
                }
              }
            } catch (error) {
              console.error('Error fetching last track from Spotify:', error)
            }
          }

          // For debugging - let's include ALL displays for now to see what's happening
          // Only include public displays (commented out for debugging)
          // if (userPrefs && userPrefs.privacySettings?.isPublic === true) {

          const isPublic = userPrefs?.privacySettings?.isPublic === true
          console.log(`🏆 Display ${view._id} isPublic: ${isPublic}`)

          return {
            identifier: view._id,
            viewCount: view.viewCount,
            lastViewed: view.lastViewed,
            displayName: userPrefs?.publicDisplaySettings?.displayName ||
                        userPrefs?.privacySettings?.customSlug ||
                        view._id,
            lastTrack: lastTrack,
            isCustomSlug: !!userPrefs?.privacySettings?.customSlug,
            isPublic: isPublic
          }
          // }
          // return null
        } catch (error) {
          console.error('Error enriching view data:', error)
          return null
        }
      })
    )

    // Filter out null values and get current viewers for each display
    const validViews = enrichedViews.filter(view => view !== null)

    // Get current viewers for each display
    const displaysWithViewers = await Promise.all(
      validViews.map(async (display) => {
        const currentViewers = await viewsCollection.distinct('sessionId', {
          identifier: display.identifier,
          type: 'display',
          timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
        })

        return {
          ...display,
          currentViewers: currentViewers.length
        }
      })
    )

    console.log(`🏆 Final displays with viewers:`, displaysWithViewers)

    return NextResponse.json({
      success: true,
      displays: displaysWithViewers,
      period: `${days} days`,
      total: displaysWithViewers.length
    })
  } catch (error) {
    console.error('Error getting top views:', error)
    return NextResponse.json({ error: 'Failed to get top views' }, { status: 500 })
  }
}
