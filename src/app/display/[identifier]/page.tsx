'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Music, Clock, User } from 'lucide-react'
import Image from 'next/image'
import { formatDuration, getMediumImage } from '@/lib/utils'
import { useTheme, useThemeClasses } from '@/contexts/theme-context'
import { getTheme } from '@/lib/themes'

interface DisplayTrack {
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string; height: number; width: number }>
  }
  duration_ms: number
  is_playing: boolean
  progress_ms: number
  external_urls?: { spotify: string }
  credits?: {
    spotify_url: string
    artists: Array<{ name: string }>
    album: {
      name: string
      spotify_url: string
    }
    track_id: string
    uri: string
  }
  recent_tracks?: Array<{
    name: string
    artists: Array<{ name: string }>
    album: {
      name: string
      images: Array<{ url: string; height: number; width: number }>
    }
    duration_ms: number
    external_urls: { spotify: string }
    played_at: string
  }>
  error?: string
}

export default function PublicDisplay() {
  const params = useParams()
  const identifier = params.identifier as string
  const { setTheme } = useTheme()
  const themeClasses = useThemeClasses()
  const [currentTrack, setCurrentTrack] = useState<DisplayTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [fakeProgress, setFakeProgress] = useState(0)
  const [lastRealProgress, setLastRealProgress] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const [userTheme, setUserTheme] = useState<string>('default')

  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        // First try to get user preferences by identifier
        const response = await fetch(`/api/public/spotify/${identifier}`)
        if (response.ok) {
          const userData = await response.json()
          if (userData.preferences?.displaySettings?.displayTheme) {
            const themeId = userData.preferences.displaySettings.displayTheme
            setUserTheme(themeId)
            setTheme(themeId, 'display')
          }
        }
      } catch (error) {
        console.error('Error fetching user theme:', error)
        // Use default theme on error
        setTheme('default', 'display')
      }
    }

    fetchUserTheme()
  }, [identifier, setTheme])

  useEffect(() => {
    const fetchCurrentTrack = async (isInitial = false) => {
      try {
        const response = await fetch(`/api/display/${identifier}`)

        if (response.ok) {
          const data = await response.json()
          setCurrentTrack(data)
          setLastUpdate(new Date())

          // Update real progress tracking
          if (data.progress_ms) {
            setLastRealProgress(data.progress_ms)
            setFakeProgress(data.progress_ms)
            setLastUpdateTime(Date.now())
          }
        } else if (response.status === 404) {
          // Privacy enabled or user not found
          setCurrentTrack({
            name: '',
            artists: [],
            album: { name: '', images: [] },
            duration_ms: 0,
            is_playing: false,
            progress_ms: 0,
            error: 'Display not found or private'
          })
        }
      } catch (error) {
        console.error('Error fetching track:', error)
        setCurrentTrack({
          name: '',
          artists: [],
          album: { name: '', images: [] },
          duration_ms: 0,
          is_playing: false,
          progress_ms: 0,
          error: 'Error loading display'
        })
      } finally {
        if (isInitial) {
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchCurrentTrack(true)

    // Refresh every 20 seconds for real data
    const realInterval = setInterval(() => fetchCurrentTrack(false), 20000)

    return () => clearInterval(realInterval)
  }, [identifier])

  // Fake progress updates every second for smooth animation
  useEffect(() => {
    if (!currentTrack?.is_playing || !currentTrack?.duration_ms) return

    const fakeInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime
      const newFakeProgress = lastRealProgress + timeSinceLastUpdate

      // Only update if we haven't exceeded the track duration
      if (newFakeProgress < currentTrack.duration_ms) {
        setFakeProgress(newFakeProgress)
      }
    }, 1000)

    return () => clearInterval(fakeInterval)
  }, [currentTrack?.is_playing, currentTrack?.duration_ms, lastRealProgress, lastUpdateTime])

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-4`}>
        <Card className={themeClasses.getCardClasses()}>
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="w-20 h-20 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle error states
  if (currentTrack?.error) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-4`}>
        <Card className={themeClasses.getCardClasses()}>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Display Not Available</h2>
                <p className="text-muted-foreground">
                  {currentTrack.error === 'Display not found or private'
                    ? "This display is private or doesn't exist. If you own this display, check your privacy settings."
                    : currentTrack.error
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Create display track - use current track or fall back to most recent track
  const displayTrack = (() => {
    // If we have a current track, use it
    if (currentTrack && currentTrack.name) {
      return currentTrack
    }

    // If no current track but we have recent tracks, use the most recent one
    if (currentTrack?.recent_tracks && currentTrack.recent_tracks.length > 0) {
      const mostRecent = currentTrack.recent_tracks[0]
      return {
        name: mostRecent.name,
        artists: mostRecent.artists,
        album: mostRecent.album,
        duration_ms: mostRecent.duration_ms,
        is_playing: false,
        progress_ms: mostRecent.duration_ms, // Show as completed
        external_urls: mostRecent.external_urls,
        recent_tracks: currentTrack.recent_tracks
      }
    }

    // Fallback to placeholder only if no data at all
    return {
      name: "No track playing",
      artists: [{ name: "Not listening" }],
      album: {
        name: "No album",
        images: []
      },
      duration_ms: 0,
      is_playing: false,
      progress_ms: 0,
      recent_tracks: currentTrack?.recent_tracks || []
    }
  })()

  const track = displayTrack
  const albumImage = getMediumImage(track.album.images)
  const currentProgress = track.is_playing ? fakeProgress : (track.progress_ms || 0)
  const duration = track.duration_ms
  const progressPercent = duration > 0 ? (currentProgress / duration) * 100 : 0

  return (
    <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-4`}>
      <div className={`w-full ${track.recent_tracks && track.recent_tracks.length > 0 ? 'max-w-6xl' : 'max-w-2xl'} ${themeClasses.shadow}`}>
        <div className={`${track.recent_tracks && track.recent_tracks.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}`}>
          {/* Main Track Display */}
          <Card className={`${track.recent_tracks && track.recent_tracks.length > 0 ? 'lg:col-span-2' : ''} ${themeClasses.getCardClasses()}`}>
            <CardContent className="p-8">
              {/* Vertical stacked layout - everything centered */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Album Art - Largest element at the top */}
                <div className="relative">
                  {albumImage && track.name !== "No track playing" ? (
                    <Image
                      src={albumImage}
                      alt={`${track.album.name} cover`}
                      width={240}
                      height={240}
                      className="rounded-xl shadow-xl"
                    />
                  ) : (
                    <div className="w-[240px] h-[240px] bg-muted rounded-xl shadow-xl flex items-center justify-center">
                      <Music className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {track.is_playing && (
                    <div className="absolute inset-0 rounded-xl border-3 border-primary animate-pulse"></div>
                  )}
                </div>

                {/* Track Info - Stacked vertically below the image */}
                <div className="w-full space-y-4 max-w-md">
                  {/* Song Title - Directly under the image */}
                  <div>
                    <h1 className={`text-3xl font-bold ${track.name === "No track playing" ? themeClasses.secondaryText : themeClasses.text}`}>
                      {track.name}
                    </h1>
                  </div>

                  {/* Artist - Under the song title */}
                  <div className={`${themeClasses.secondaryText}`}>
                    <p className="text-xl">
                      {track.artists.map((artist: { name: string }) => artist.name).join(', ')}
                    </p>
                  </div>

                  {/* Album - Under the artist */}
                  <div className={`text-lg ${themeClasses.secondaryText}`}>
                    <p>
                      from <span className="font-medium">{track.album.name}</span>
                    </p>
                  </div>

                  {/* Progress and Duration - Under everything else */}
                  {track.name !== "No track playing" && (
                    <div className="space-y-3 w-full">
                      <div className={`w-full ${themeClasses.getProgressClasses().background} rounded-full h-2`}>
                        <div
                          className={`${themeClasses.getProgressClasses().bar} h-2 rounded-full transition-all duration-1000 ease-linear`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                      <div className={`flex items-center justify-between text-sm ${themeClasses.secondaryText}`}>
                        <span>{formatDuration(currentProgress)}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(duration)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status - At the bottom */}
                  <div className="flex flex-col items-center space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${track.is_playing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm ${themeClasses.secondaryText}`}>
                        {track.name === "No track playing"
                          ? 'Not listening'
                          : track.is_playing
                            ? 'Now playing'
                            : currentTrack && currentTrack.name
                              ? 'Paused'
                              : 'Last played'
                        }
                      </span>
                    </div>
                    <span className={`text-xs ${themeClasses.secondaryText}`}>
                      Updated {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credits Section - only show for real tracks */}
              {currentTrack?.credits && track.name !== "No track playing" && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className={`text-sm font-medium mb-2 ${themeClasses.text}`}>Track Credits</h3>
                  <div className={`space-y-2 text-sm ${themeClasses.secondaryText}`}>
                    <div>
                      <span className="font-medium">Track ID:</span> {currentTrack.credits.track_id}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={currentTrack.credits.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Open Track in Spotify
                      </a>
                      {currentTrack.credits.album.spotify_url && (
                        <a
                          href={currentTrack.credits.album.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          Open Album in Spotify
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Powered by - only show when no recent tracks */}
              {(!track.recent_tracks || track.recent_tracks.length === 0) && (
                <div className="mt-6 pt-4 border-t text-center">
                  <p className={`text-xs ${themeClasses.secondaryText}`}>
                    Powered by <span className="font-medium">SpotifyUtil</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tracks Sidebar - always show if there are recent tracks */}
          {track.recent_tracks && track.recent_tracks.length > 0 && (
            <Card className={`lg:col-span-1 ${themeClasses.getCardClasses()}`}>
              <CardContent className="p-6">
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${themeClasses.text}`}>
                  <Clock className="h-4 w-4 mr-2" />
                  Recently Played
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {track.recent_tracks.map((recentTrack, index) => (
                    <div key={index} className={`group ${themeClasses.hover} p-2 rounded-lg transition-colors`}>
                      <div className="flex items-start space-x-3">
                        {recentTrack.album.images[0] && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={getMediumImage(recentTrack.album.images) || recentTrack.album.images[0].url}
                              alt={recentTrack.album.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate text-sm leading-tight mb-1 ${themeClasses.text}`}>{recentTrack.name}</p>
                          <p className={`text-xs truncate mb-1 ${themeClasses.secondaryText}`}>
                            {recentTrack.artists.map(artist => artist.name).join(', ')}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs ${themeClasses.secondaryText}`}>
                              {new Date(recentTrack.played_at).toLocaleTimeString()}
                            </p>
                            <a
                              href={recentTrack.external_urls.spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs ${themeClasses.accent} hover:opacity-80 opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                              Open
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Powered by - in sidebar when recent tracks exist */}
                <div className="mt-4 pt-4 border-t text-center">
                  <p className={`text-xs ${themeClasses.secondaryText}`}>
                    Powered by <span className="font-medium">SpotifyUtil</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
