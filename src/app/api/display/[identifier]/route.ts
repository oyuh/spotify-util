import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { getUserPreferences, getUserBySpotifyId } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logSecurityEvent } from "@/lib/security"

const client = new MongoClient(process.env.MONGODB_URI!)

async function refreshSpotifyToken(refreshToken: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`)
  }

  return response.json()
}

async function getSpotifyData(accessToken: string, endpoint: string) {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 204) {
      return null // No content (not playing)
    }
    if (response.status === 403) {
      console.log(`🚫 Spotify API 403 Forbidden for endpoint ${endpoint}`)
      console.log('🔑 Token info - Access Token present:', !!accessToken)
      console.log('🔑 Token length:', accessToken?.length || 0)
      console.log('🔑 Token preview:', accessToken ? `${accessToken.substring(0, 10)}...` : 'none')

      // Return a specific error object for 403 so we can handle it gracefully
      return { error: 'forbidden', status: 403, message: 'Spotify access forbidden - token may be expired or revoked' }
    }
    if (response.status === 401) {
      console.log(`🚫 Spotify API 401 Unauthorized for endpoint ${endpoint}`)
      throw new Error(`Spotify API error: ${response.status}`)
    }
    throw new Error(`Spotify API error: ${response.status}`)
  }

  // Check if response has content before parsing JSON
  const text = await response.text()
  if (!text || text.trim() === '') {
    return null // Empty response
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error('Failed to parse Spotify API response:', text)
    throw new Error('Invalid JSON response from Spotify API')
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params

    // Validate identifier format to prevent injection attacks
    if (!identifier || typeof identifier !== 'string' || identifier.length > 50) {
      logSecurityEvent('INVALID_IDENTIFIER', { identifier, endpoint: '/api/display' }, request)
      return NextResponse.json({ error: "Invalid identifier" }, { status: 400 })
    }

    console.log('Display API called with identifier:', identifier)

    // Connect to database
    const db = client.db("spotify-util")
    const accounts = db.collection("accounts")

    console.log('Looking for account with providerAccountId:', identifier)

    // Try multiple ways to find the account
    let account = await accounts.findOne({
      providerAccountId: identifier,
      provider: "spotify"
    })

    // If not found, try looking in the users collection or different field names
    if (!account) {
      console.log('Not found by providerAccountId, trying userId...')
      account = await accounts.findOne({
        userId: identifier,
        provider: "spotify"
      })
    }

    // If we found an account, check privacy settings
    if (account) {
      console.log('Found account for Spotify ID:', identifier, 'with userId:', account.userId)

      // Look up preferences by Spotify ID (the identifier is the Spotify ID)
      let userPrefs = await getUserBySpotifyId(identifier)

      console.log('User preferences found:', userPrefs ? 'Yes' : 'No')
      if (userPrefs) {
        console.log('Privacy settings:', JSON.stringify(userPrefs?.privacySettings, null, 2))
      } else {
        console.log('No user preferences found for Spotify ID:', identifier)
      }

      // If user has privacy enabled (isPublic = false), they can only be accessed via slug
      if (userPrefs && userPrefs.privacySettings && userPrefs.privacySettings.isPublic === false) {
        console.log('🔒 PRIVACY CHECK: User has privacy enabled, access denied via Spotify ID')
        console.log('User should use slug instead:', userPrefs.privacySettings.customSlug)
        logSecurityEvent('PRIVACY_BLOCKED_ACCESS', { identifier }, request)
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      } else {
        console.log('✅ PRIVACY CHECK: User is public or no preferences found, allowing access')
        if (userPrefs?.privacySettings) {
          console.log('Privacy settings isPublic value:', userPrefs.privacySettings.isPublic)
        }
      }
    }    // Let's also check what accounts exist
    if (!account) {
      console.log('Still not found, checking all spotify accounts...')
      const allSpotifyAccounts = await accounts.find({ provider: "spotify" }).toArray()
      console.log('All Spotify accounts found:', allSpotifyAccounts.map(acc => ({
        providerAccountId: acc.providerAccountId,
        userId: acc.userId,
        hasAccessToken: !!acc.access_token
      })))
    }

    console.log('Found account:', account ? 'Yes' : 'No')
    console.log('Account has access_token:', account?.access_token ? 'Yes' : 'No')

    if (!account || !account.access_token) {
      console.log('No account or access token found')
      return NextResponse.json({
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false,
        recent_tracks: [],
        error: 'No access token available'
      })
    }

    console.log('Fetching current track from Spotify...')

    let accessToken = account.access_token

    // Try to get current track, refresh token if needed
    try {
      console.log('Calling Spotify API for currently-playing...')
      const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

      // Check if we got a 403 error response
      if (currentTrack && typeof currentTrack === 'object' && currentTrack.error === 'forbidden') {
        console.log('🚫 Got 403 Forbidden from Spotify API - handling gracefully')
        return NextResponse.json({
          name: 'Access Forbidden',
          artists: [{ name: 'Spotify access temporarily unavailable' }],
          album: { name: '', images: [] },
          is_playing: false,
          recent_tracks: [],
          error: 'Spotify access forbidden - the user may need to re-authenticate',
          errorDetails: {
            status: 403,
            message: 'Token may be expired, revoked, or insufficient permissions',
            suggestion: 'User should try logging out and back in'
          }
        }, { status: 403 })
      }

      console.log('Spotify currently-playing response:', currentTrack ? 'Got data' : 'No data (null)')

      if (!currentTrack || !currentTrack.item) {
        console.log('No current track or item - fetching last played track instead')

        // Even when no track is playing, check if user wants recent tracks shown
        let sessionUserId = account.userId

        // The key fix: preferences are stored by spotifyId, not by the account userId
        // So we should look up preferences by spotifyId (which is the identifier)
        console.log('Looking for user preferences by spotifyId:', identifier)
        let userPreferences = await getUserPreferences(identifier)

        // If not found by spotifyId, try looking up by the spotifyId field in preferences
        if (!userPreferences) {
          console.log('Not found by userId, trying getUserBySpotifyId...')
          userPreferences = await getUserBySpotifyId(identifier)
        }

        // If still not found, try the account.userId as fallback
        if (!userPreferences) {
          console.log('Still not found, trying account.userId as fallback:', account.userId)
          userPreferences = await getUserPreferences(account.userId)
        }

        console.log('User preferences found:', userPreferences ? 'Yes' : 'No')
        if (userPreferences) {
          console.log('FULL USER PREFERENCES DATA (FORCED REBUILD):', JSON.stringify(userPreferences, null, 2))
          console.log('Display settings:', JSON.stringify(userPreferences.displaySettings, null, 2))
          console.log('Public display settings:', JSON.stringify(userPreferences.publicDisplaySettings, null, 2))
          console.log('Show recent tracks setting:', userPreferences.publicDisplaySettings?.showRecentTracks)
          console.log('Number of recent tracks:', userPreferences.publicDisplaySettings?.numberOfRecentTracks)
        }

        // ALWAYS fetch recent tracks to get the last played song
        let recentTracksData = null
        let lastPlayedTrack = null
        try {
          console.log('Fetching recent tracks to get last played song...')
          const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPreferences?.publicDisplaySettings?.numberOfRecentTracks || 10}`)

          // Check if recent tracks also got a 403
          if (recentTracks && typeof recentTracks === 'object' && recentTracks.error === 'forbidden') {
            console.log('🚫 Got 403 Forbidden from recent tracks API too')
            return NextResponse.json({
              name: 'Access Forbidden',
              artists: [{ name: 'Spotify access temporarily unavailable' }],
              album: { name: '', images: [] },
              is_playing: false,
              recent_tracks: [],
              error: 'Spotify access forbidden - the user may need to re-authenticate',
              errorDetails: {
                status: 403,
                message: 'Token may be expired, revoked, or insufficient permissions',
                suggestion: 'User should try logging out and back in'
              }
            }, { status: 403 })
          }

          console.log('Recent tracks response:', recentTracks ? `Got ${recentTracks.items?.length || 0} tracks` : 'No data')

          if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
            recentTracksData = recentTracks.items.map((item: any) => ({
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album,
              duration_ms: item.track.duration_ms,
              external_urls: item.track.external_urls,
              played_at: item.played_at
            }))

            // Use the most recent track as the main display
            lastPlayedTrack = recentTracks.items[0].track
            console.log('Using last played track as main display:', lastPlayedTrack.name)
          }
        } catch (error) {
          console.log('Error fetching recent tracks when no current track:', error)
        }

        // If we have a last played track, return it as the main track
        if (lastPlayedTrack) {
          const response: any = {
            name: lastPlayedTrack.name,
            is_playing: false, // It's not currently playing
            duration_ms: lastPlayedTrack.duration_ms,
            progress_ms: lastPlayedTrack.duration_ms, // Show as completed
          }

          // Apply user preferences for data visibility
          if (userPreferences?.publicDisplaySettings) {
            const settings = userPreferences.publicDisplaySettings

            if (settings.showArtist) {
              response.artists = lastPlayedTrack.artists
            } else {
              response.artists = []
            }

            if (settings.showAlbum) {
              response.album = lastPlayedTrack.album
            } else {
              response.album = { name: '', images: [] }
            }

            if (settings.showCredits) {
              response.credits = {
                spotify_url: lastPlayedTrack.external_urls?.spotify,
                artists: lastPlayedTrack.artists,
                album: {
                  name: lastPlayedTrack.album.name,
                  spotify_url: lastPlayedTrack.album.external_urls?.spotify
                },
                track_id: lastPlayedTrack.id,
                uri: lastPlayedTrack.uri
              }
            }

            if (settings.showRecentTracks && recentTracksData) {
              response.recent_tracks = recentTracksData
            }
          } else {
            // Default behavior if no preferences found
            response.artists = lastPlayedTrack.artists
            response.album = lastPlayedTrack.album
            response.credits = {
              spotify_url: lastPlayedTrack.external_urls?.spotify,
              artists: lastPlayedTrack.artists,
              album: {
                name: lastPlayedTrack.album.name,
                spotify_url: lastPlayedTrack.album.external_urls?.spotify
              },
              track_id: lastPlayedTrack.id,
              uri: lastPlayedTrack.uri
            }
            response.recent_tracks = recentTracksData || []
          }

          return NextResponse.json({
            ...response,
            preferences: userPreferences
          })
        }

        // Fallback if no recent tracks available
        return NextResponse.json({
          name: 'No recent tracks available',
          artists: [{ name: 'No data' }],
          album: { name: '', images: [] },
          duration_ms: 0,
          is_playing: false,
          progress_ms: 0,
          recent_tracks: [],
          preferences: userPreferences
        })
      }

      console.log('Returning track data:', currentTrack.item.name)

      // Get user preferences to determine what data to return
      // The key fix: preferences are stored by spotifyId, not by the account userId
      // So we should look up preferences by spotifyId (which is the identifier)
      console.log('Looking for user preferences by spotifyId:', identifier)
      let userPreferences = await getUserPreferences(identifier)

      // If not found by spotifyId, try looking up by the spotifyId field in preferences
      if (!userPreferences) {
        console.log('Not found by userId, trying getUserBySpotifyId...')
        userPreferences = await getUserBySpotifyId(identifier)
      }

      // If still not found, try the account.userId as fallback
      if (!userPreferences) {
        console.log('Still not found, trying account.userId as fallback:', account.userId)
        userPreferences = await getUserPreferences(account.userId)
      }

      console.log('User preferences found:', userPreferences ? 'Yes' : 'No')
      if (userPreferences) {
        console.log('User preferences data:', JSON.stringify(userPreferences.publicDisplaySettings, null, 2))
        console.log('Show recent tracks setting:', userPreferences.publicDisplaySettings?.showRecentTracks)
        console.log('Number of recent tracks:', userPreferences.publicDisplaySettings?.numberOfRecentTracks)
      }

      // Build response based on user preferences
      const response: any = {
        name: currentTrack.item.name,
        is_playing: currentTrack.is_playing
      }

      // Fetch recent tracks if needed
      let recentTracksData = null
      if (userPreferences?.publicDisplaySettings?.showRecentTracks) {
        try {
          const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPreferences.publicDisplaySettings.numberOfRecentTracks || 5}`)

          // Check if recent tracks got a 403 (shouldn't happen if current track worked, but just in case)
          if (recentTracks && typeof recentTracks === 'object' && recentTracks.error === 'forbidden') {
            console.log('🚫 Got 403 Forbidden from recent tracks API (unexpected)')
            // Don't fail the whole request, just don't include recent tracks
            recentTracksData = null
          } else if (recentTracks && recentTracks.items) {
            recentTracksData = recentTracks.items.map((item: any) => ({
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album,
              duration_ms: item.track.duration_ms,
              external_urls: item.track.external_urls,
              played_at: item.played_at
            }))
          }
        } catch (error) {
          console.log('Error fetching recent tracks:', error)
        }
      }

      // Apply user preferences for data visibility
      if (userPreferences?.publicDisplaySettings) {
        const settings = userPreferences.publicDisplaySettings

        if (settings.showArtist) {
          response.artists = currentTrack.item.artists
        } else {
          response.artists = []
        }

        if (settings.showAlbum) {
          response.album = currentTrack.item.album
        } else {
          response.album = { name: '', images: [] }
        }

        if (settings.showDuration) {
          response.duration_ms = currentTrack.item.duration_ms
        }

        if (settings.showProgress) {
          response.progress_ms = currentTrack.progress_ms
        }

        if (settings.showCredits) {
          // Enhanced credits information
          response.credits = {
            spotify_url: currentTrack.item.external_urls?.spotify,
            artists: currentTrack.item.artists,
            album: {
              name: currentTrack.item.album.name,
              spotify_url: currentTrack.item.album.external_urls?.spotify
            },
            track_id: currentTrack.item.id,
            uri: currentTrack.item.uri
          }
        }

        // Always show recent tracks if user has that setting enabled
        if (settings.showRecentTracks && recentTracksData) {
          response.recent_tracks = recentTracksData
        }
      } else {
        // Default behavior if no preferences found
        response.artists = currentTrack.item.artists
        response.album = currentTrack.item.album
        response.duration_ms = currentTrack.item.duration_ms
        response.progress_ms = currentTrack.progress_ms
        response.credits = {
          spotify_url: currentTrack.item.external_urls?.spotify,
          artists: currentTrack.item.artists,
          album: {
            name: currentTrack.item.album.name,
            spotify_url: currentTrack.item.album.external_urls?.spotify
          },
          track_id: currentTrack.item.id,
          uri: currentTrack.item.uri
        }
        // Always fetch recent tracks in default mode too
        response.recent_tracks = recentTracksData || []
      }

      return NextResponse.json({
        ...response,
        preferences: userPreferences
      })
    } catch (error) {
      // If we get a 401, try to refresh the token
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Display API - Access token expired, attempting refresh...')

        if (!account.refresh_token) {
          throw new Error('No refresh token available')
        }

        try {
          const refreshData = await refreshSpotifyToken(account.refresh_token)
          accessToken = refreshData.access_token

          // Update the token in the database
          await accounts.updateOne(
            { _id: account._id },
            {
              $set: {
                access_token: accessToken,
                expires_at: Math.floor(Date.now() / 1000) + refreshData.expires_in
              }
            }
          )

          console.log('Display API - Token refreshed successfully')

          // Retry the request with new token
          const currentTrack = await getSpotifyData(accessToken, '/me/player/currently-playing')

          // Check if we got a 403 error even after refresh
          if (currentTrack && typeof currentTrack === 'object' && currentTrack.error === 'forbidden') {
            console.log('🚫 Still got 403 Forbidden after token refresh - user may have revoked access')
            return NextResponse.json({
              name: 'Access Forbidden',
              artists: [{ name: 'Spotify access temporarily unavailable' }],
              album: { name: '', images: [] },
              is_playing: false,
              recent_tracks: [],
              error: 'Spotify access forbidden even after token refresh - user may have revoked access',
              errorDetails: {
                status: 403,
                message: 'Token was refreshed but access is still forbidden',
                suggestion: 'User should try logging out and back in'
              }
            }, { status: 403 })
          }

          console.log('Spotify response after refresh:', currentTrack ? 'Got data' : 'No data')

          if (!currentTrack || !currentTrack.item) {
            console.log('No current track or item after refresh - fetching last played track instead')

            // Even when no track is playing, check if user wants recent tracks shown
            console.log('Looking for user preferences with userId after refresh:', account.userId)
            const userPreferences = await getUserPreferences(account.userId)
            console.log('User preferences found after refresh:', userPreferences ? 'Yes' : 'No')

            // ALWAYS fetch recent tracks to get the last played song
            let recentTracksData = null
            let lastPlayedTrack = null
            try {
              console.log('Fetching recent tracks to get last played song after refresh...')
              const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPreferences?.publicDisplaySettings?.numberOfRecentTracks || 10}`)

              // Check if recent tracks also got a 403 after refresh
              if (recentTracks && typeof recentTracks === 'object' && recentTracks.error === 'forbidden') {
                console.log('🚫 Got 403 Forbidden from recent tracks API after refresh too')
                return NextResponse.json({
                  name: 'Access Forbidden',
                  artists: [{ name: 'Spotify access temporarily unavailable' }],
                  album: { name: '', images: [] },
                  is_playing: false,
                  recent_tracks: [],
                  error: 'Spotify access forbidden even after token refresh',
                  errorDetails: {
                    status: 403,
                    message: 'Token was refreshed but access is still forbidden',
                    suggestion: 'User should try logging out and back in'
                  }
                }, { status: 403 })
              }

              if (recentTracks && recentTracks.items && recentTracks.items.length > 0) {
                recentTracksData = recentTracks.items.map((item: any) => ({
                  name: item.track.name,
                  artists: item.track.artists,
                  album: item.track.album,
                  duration_ms: item.track.duration_ms,
                  external_urls: item.track.external_urls,
                  played_at: item.played_at
                }))

                // Use the most recent track as the main display
                lastPlayedTrack = recentTracks.items[0].track
                console.log('Using last played track as main display after refresh:', lastPlayedTrack.name)
              }
            } catch (error) {
              console.log('Error fetching recent tracks when no current track after refresh:', error)
            }

            // If we have a last played track, return it as the main track
            if (lastPlayedTrack) {
              const response: any = {
                name: lastPlayedTrack.name,
                is_playing: false, // It's not currently playing
                duration_ms: lastPlayedTrack.duration_ms,
                progress_ms: lastPlayedTrack.duration_ms, // Show as completed
              }

              // Apply user preferences for data visibility
              if (userPreferences?.publicDisplaySettings) {
                const settings = userPreferences.publicDisplaySettings

                if (settings.showArtist) {
                  response.artists = lastPlayedTrack.artists
                } else {
                  response.artists = []
                }

                if (settings.showAlbum) {
                  response.album = lastPlayedTrack.album
                } else {
                  response.album = { name: '', images: [] }
                }

                if (settings.showCredits) {
                  response.credits = {
                    spotify_url: lastPlayedTrack.external_urls?.spotify,
                    artists: lastPlayedTrack.artists,
                    album: {
                      name: lastPlayedTrack.album.name,
                      spotify_url: lastPlayedTrack.album.external_urls?.spotify
                    },
                    track_id: lastPlayedTrack.id,
                    uri: lastPlayedTrack.uri
                  }
                }

                if (settings.showRecentTracks && recentTracksData) {
                  response.recent_tracks = recentTracksData
                }
              } else {
                // Default behavior if no preferences found
                response.artists = lastPlayedTrack.artists
                response.album = lastPlayedTrack.album
                response.credits = {
                  spotify_url: lastPlayedTrack.external_urls?.spotify,
                  artists: lastPlayedTrack.artists,
                  album: {
                    name: lastPlayedTrack.album.name,
                    spotify_url: lastPlayedTrack.album.external_urls?.spotify
                  },
                  track_id: lastPlayedTrack.id,
                  uri: lastPlayedTrack.uri
                }
                response.recent_tracks = recentTracksData || []
              }

              return NextResponse.json({
                ...response,
                preferences: userPreferences
              })
            }

            // Fallback if no recent tracks available
            return NextResponse.json({
              name: 'No recent tracks available',
              artists: [{ name: 'No data' }],
              album: { name: '', images: [] },
              duration_ms: 0,
              is_playing: false,
              progress_ms: 0,
              recent_tracks: [],
              preferences: userPreferences
            })
          }

          console.log('Returning track data after refresh:', currentTrack.item.name)

          // Get user preferences to determine what data to return
          console.log('Looking for user preferences with userId after refresh:', account.userId)
          const userPreferences = await getUserPreferences(account.userId)
          console.log('User preferences found after refresh:', userPreferences ? 'Yes' : 'No')
          if (userPreferences) {
            console.log('User preferences data after refresh:', JSON.stringify(userPreferences.publicDisplaySettings, null, 2))
          }

          // Build response based on user preferences
          const response: any = {
            name: currentTrack.item.name,
            is_playing: currentTrack.is_playing
          }

          // Fetch recent tracks if needed
          let recentTracksData = null
          if (userPreferences?.publicDisplaySettings?.showRecentTracks) {
            try {
              const recentTracks = await getSpotifyData(accessToken, `/me/player/recently-played?limit=${userPreferences.publicDisplaySettings.numberOfRecentTracks || 5}`)

              // Check if recent tracks got a 403 (shouldn't happen if current track worked, but just in case)
              if (recentTracks && typeof recentTracks === 'object' && recentTracks.error === 'forbidden') {
                console.log('🚫 Got 403 Forbidden from recent tracks API after refresh (unexpected)')
                // Don't fail the whole request, just don't include recent tracks
                recentTracksData = null
              } else if (recentTracks && recentTracks.items) {
                recentTracksData = recentTracks.items.map((item: any) => ({
                  name: item.track.name,
                  artists: item.track.artists,
                  album: item.track.album,
                  duration_ms: item.track.duration_ms,
                  external_urls: item.track.external_urls,
                  played_at: item.played_at
                }))
              }
            } catch (error) {
              console.log('Error fetching recent tracks after refresh:', error)
            }
          }

          // Apply user preferences for data visibility
          if (userPreferences?.publicDisplaySettings) {
            const settings = userPreferences.publicDisplaySettings

            if (settings.showArtist) {
              response.artists = currentTrack.item.artists
            } else {
              response.artists = []
            }

            if (settings.showAlbum) {
              response.album = currentTrack.item.album
            } else {
              response.album = { name: '', images: [] }
            }

            if (settings.showDuration) {
              response.duration_ms = currentTrack.item.duration_ms
            }

            if (settings.showProgress) {
              response.progress_ms = currentTrack.progress_ms
            }

            if (settings.showCredits) {
              response.credits = {
                spotify_url: currentTrack.item.external_urls?.spotify,
                artists: currentTrack.item.artists,
                album: {
                  name: currentTrack.item.album.name,
                  spotify_url: currentTrack.item.album.external_urls?.spotify
                },
                track_id: currentTrack.item.id,
                uri: currentTrack.item.uri
              }
            }

            // Always show recent tracks if user has that setting enabled
            if (settings.showRecentTracks && recentTracksData) {
              response.recent_tracks = recentTracksData
            }
          } else {
            // Default behavior if no preferences found
            response.artists = currentTrack.item.artists
            response.album = currentTrack.item.album
            response.duration_ms = currentTrack.item.duration_ms
            response.progress_ms = currentTrack.progress_ms
            response.credits = {
              spotify_url: currentTrack.item.external_urls?.spotify,
              artists: currentTrack.item.artists,
              album: {
                name: currentTrack.item.album.name,
                spotify_url: currentTrack.item.album.external_urls?.spotify
              },
              track_id: currentTrack.item.id,
              uri: currentTrack.item.uri
            }
            // Always fetch recent tracks in default mode too
            response.recent_tracks = recentTracksData || []
          }

          return NextResponse.json({
            ...response,
            preferences: userPreferences
          })
        } catch (refreshError) {
          console.error('Display API - Failed to refresh token:', refreshError)
          throw error // Re-throw original error
        }
      } else {
        throw error // Re-throw non-401 errors
      }
    }
  } catch (error) {
    console.error('Error in display API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('API_ERROR', { endpoint: '/api/display', error: errorMessage }, request)
    return NextResponse.json({
      name: '',
      artists: [],
      album: { name: '', images: [] },
      is_playing: false,
      recent_tracks: [],
      error: 'Failed to fetch track data'
    }, { status: 500 })
  }
}
