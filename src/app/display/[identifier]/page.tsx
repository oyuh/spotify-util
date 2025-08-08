'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Music, Clock, User } from 'lucide-react'
import Image from 'next/image'
import { formatDuration, getMediumImage } from '@/lib/utils'
import { useDisplayStyle, useDisplayStyleClasses } from '@/contexts/display-style-context-v2'
import { getDisplayStyle } from '@/lib/app-themes'
// import { ViewCounter } from '@/components/ViewCounter'

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
  console.log('DISPLAY PAGE: Component rendering!')
  const params = useParams()
  const identifier = params.identifier as string
  const { setStyleWithPreferences } = useDisplayStyle()
  const styleClasses = useDisplayStyleClasses()

  const [currentTrack, setCurrentTrack] = useState<DisplayTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [fakeProgress, setFakeProgress] = useState(0)
  const [lastRealProgress, setLastRealProgress] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const [userStyle, setUserStyle] = useState<string>('minimal')
  const [displayName, setDisplayName] = useState<string>('JamLog')
  const [hasBackgroundImage, setHasBackgroundImage] = useState<boolean>(false)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [themeLoaded, setThemeLoaded] = useState(false)
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Update document title when display name changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = displayName
    }
  }, [displayName])

  // Refresh mechanism - force reload of all data
  const refreshDisplay = () => {
    console.log('🔄 DISPLAY PAGE: Manual refresh triggered')
    setRefreshKey(prev => prev + 1)
    setThemeLoaded(false)
    setBackgroundLoaded(false)
    setPreferencesLoaded(false)
    setLoading(true)
  }

  // Listen for refresh events and keyboard shortcuts
  useEffect(() => {
    const handleRefresh = () => refreshDisplay()
    const handleKeyPress = (e: KeyboardEvent) => {
      // Refresh with R key or F5
      if (e.key === 'r' || e.key === 'R' || e.key === 'F5') {
        e.preventDefault()
        refreshDisplay()
      }
    }

    window.addEventListener('display-refresh', handleRefresh)
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('display-refresh', handleRefresh)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Combined effect to load data in correct order: Theme -> Background -> Prefs -> Track
  useEffect(() => {
    console.log('🎨 DISPLAY PAGE: Starting load sequence, identifier:', identifier, 'refreshKey:', refreshKey)

    const loadDisplayDataSequentially = async () => {
      try {
        setLoading(true)
        console.log('📋 DISPLAY PAGE: Step 1 - Fetching display data for:', identifier)

        // Single API call to get all data
        let response: Response

        // First try as a slug
        console.log('🔍 DISPLAY PAGE: Trying slug endpoint')
        response = await fetch(`/api/public/display/${identifier}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        console.log('🔍 DISPLAY PAGE: Slug API response status:', response.status)

        // If slug fails with 404, try as Spotify ID
        if (!response.ok && response.status === 404) {
          console.log('🔍 DISPLAY PAGE: Slug failed, trying Spotify ID endpoint')
          response = await fetch(`/api/display/${identifier}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          })
          console.log('🔍 DISPLAY PAGE: Spotify ID API response status:', response.status)
        }

        if (response.ok) {
          const data = await response.json()
          console.log('📋 DISPLAY PAGE: Combined API response data:', data)

          // STEP 1: Apply THEME first (highest priority)
          console.log('🎨 DISPLAY PAGE: Step 1 - Loading theme')
          if (data.preferences?.displaySettings?.style) {
            const styleId = data.preferences.displaySettings.style
            console.log('🎨 DISPLAY PAGE: Applying theme:', styleId)
            setUserStyle(styleId)
            setThemeLoaded(true)
            // Small delay to ensure theme loads
            await new Promise(resolve => setTimeout(resolve, 100))
          } else {
            console.log('🎨 DISPLAY PAGE: No theme found, using minimal')
            setUserStyle('minimal')
            setThemeLoaded(true)
          }

          // STEP 2: Apply BACKGROUND IMAGE second
          console.log('🖼️ DISPLAY PAGE: Step 2 - Loading background image')
          const customBackground = data.preferences?.displaySettings?.backgroundImage
          if (customBackground) {
            console.log('🖼️ DISPLAY PAGE: Custom background found:', customBackground)
            setHasBackgroundImage(true)
            // Give background time to load
            await new Promise(resolve => setTimeout(resolve, 200))
          } else {
            console.log('🖼️ DISPLAY PAGE: No custom background')
            setHasBackgroundImage(false)
          }
          setBackgroundLoaded(true)

          // STEP 3: Apply all PREFERENCES third
          console.log('⚙️ DISPLAY PAGE: Step 3 - Loading preferences')
          if (data.preferences) {
            console.log('⚙️ DISPLAY PAGE: Applying all preferences:', data.preferences)

            // Set display name
            if (data.preferences?.publicDisplaySettings?.displayName) {
              setDisplayName(data.preferences.publicDisplaySettings.displayName)
            } else if (data.preferences?.slug) {
              setDisplayName(data.preferences.slug)
            } else {
              setDisplayName(identifier)
            }

            // Apply complete style with all preferences
            setStyleWithPreferences(userStyle, data.preferences)
            setPreferencesLoaded(true)
            // Give preferences time to apply
            await new Promise(resolve => setTimeout(resolve, 150))
          } else {
            console.log('⚙️ DISPLAY PAGE: No preferences found, using defaults')
            setDisplayName(identifier)
            setStyleWithPreferences('minimal', {})
            setPreferencesLoaded(true)
          }

          // STEP 4: Load TRACK INFO last
          console.log('🎵 DISPLAY PAGE: Step 4 - Loading track info')
          setCurrentTrack(data)
          setLastUpdate(new Date())

          // Update real progress tracking
          if (data.progress_ms) {
            setLastRealProgress(data.progress_ms)
            setFakeProgress(data.progress_ms)
            setLastUpdateTime(Date.now())
          }

          console.log('✅ DISPLAY PAGE: All data loaded successfully in correct order')

        } else if (response.status === 404) {
          // Handle 404 - neither slug nor Spotify ID worked
          console.log('❌ DISPLAY PAGE: 404 error, user not found')
          setDisplayName(identifier)
          setUserStyle('minimal')
          setThemeLoaded(true)
          setHasBackgroundImage(false)
          setBackgroundLoaded(true)
          setStyleWithPreferences('minimal', {})
          setPreferencesLoaded(true)

          setCurrentTrack({
            name: '',
            artists: [],
            album: { name: '', images: [] },
            duration_ms: 0,
            is_playing: false,
            progress_ms: 0,
            error: 'Display not found - this identifier may not exist or be private'
          })
        }
      } catch (error) {
        console.error('❌ DISPLAY PAGE: Error fetching display data:', error)
        // Use defaults on error
        setDisplayName(identifier)
        setUserStyle('minimal')
        setThemeLoaded(true)
        setHasBackgroundImage(false)
        setBackgroundLoaded(true)
        setStyleWithPreferences('minimal', {})
        setPreferencesLoaded(true)

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
        console.log('🏁 DISPLAY PAGE: Loading sequence complete')
        setLoading(false)
      }
    }

    loadDisplayDataSequentially()
  }, [identifier, refreshKey, setStyleWithPreferences])

  // Remove the auto-refresh fallback as it was causing issues

  // Regular track updates (separate from initial load) - ONLY update track data, not preferences
  useEffect(() => {
    // Don't start regular updates until all core components are loaded
    if (!themeLoaded || !backgroundLoaded || !preferencesLoaded) {
      console.log('⏳ DISPLAY PAGE: Waiting for theme/background/prefs to load before starting track updates')
      return
    }

    console.log('🔄 DISPLAY PAGE: Starting regular track updates')

    const fetchCurrentTrack = async () => {
      try {
        let response: Response

        // Use the same endpoint logic as initial load
        console.log('🎵 DISPLAY PAGE: Updating track data only for:', identifier)
        response = await fetch(`/api/public/display/${identifier}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })

        if (!response.ok && response.status === 404) {
          response = await fetch(`/api/display/${identifier}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          })
        }

        if (response.ok) {
          const data = await response.json()
          console.log('🎵 DISPLAY PAGE: Track update received:', data)

          // ONLY update track data - DO NOT touch preferences, theme, or style
          setCurrentTrack(data)
          setLastUpdate(new Date())

          if (data.progress_ms) {
            setLastRealProgress(data.progress_ms)
            setFakeProgress(data.progress_ms)
            setLastUpdateTime(Date.now())
          }
        }
      } catch (error) {
        console.error('❌ DISPLAY PAGE: Error updating track:', error)
      }
    }

    // Initial delay, then regular updates
    const initialDelay = setTimeout(() => {
      fetchCurrentTrack()

      const interval = setInterval(fetchCurrentTrack, 5000)
      return () => clearInterval(interval)
    }, 3000) // Slightly shorter delay since everything is loaded

    return () => clearTimeout(initialDelay)
  }, [identifier, themeLoaded, backgroundLoaded, preferencesLoaded])

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
    // Show loading progress with steps
    const getLoadingStep = () => {
      if (!themeLoaded) return "Loading theme..."
      if (!backgroundLoaded) return "Loading background..."
      if (!preferencesLoaded) return "Loading preferences..."
      return "Loading track info..."
    }

    const getLoadingProgress = () => {
      let progress = 0
      if (themeLoaded) progress += 25
      if (backgroundLoaded) progress += 25
      if (preferencesLoaded) progress += 25
      if (currentTrack) progress += 25
      return progress
    }

    return (
      <div data-display-container="true" className={`min-h-screen ${styleClasses.background} flex items-center justify-center p-4`}>
        <Card className={`${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4 animate-pulse">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>

              {/* Loading progress */}
              <div className="w-full max-w-xs">
                <div className="text-xs text-muted-foreground text-center mb-2">
                  {getLoadingStep()}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getLoadingProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {getLoadingProgress()}% complete
                </div>
              </div>

              {/* Refresh hint */}
              <div className="text-xs text-muted-foreground/60 text-center">
                Press R or F5 to refresh
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
      <div data-display-container="true" className={`min-h-screen ${styleClasses.background} flex items-center justify-center p-4`}>
        <Card className={`${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
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

  // Use the track data directly from the API (no more fallbacks needed)
  const track = currentTrack || {
    name: "Loading...",
    artists: [{ name: "Please wait" }],
    album: { name: "", images: [] },
    duration_ms: 0,
    is_playing: false,
    progress_ms: 0,
    recent_tracks: []
  }

  const albumImage = getMediumImage(track.album.images)
  const currentProgress = track.is_playing ? fakeProgress : (track.progress_ms || 0)
  const duration = track.duration_ms
  const progressPercent = duration > 0 ? (currentProgress / duration) * 100 : 0

  return (
    <div
      id="display-background"
      data-display-container="true"
      className={`min-h-screen ${styleClasses.background} ${styleClasses.fontFamily} ${hasBackgroundImage ? 'display-with-bg' : ''} flex items-center justify-center p-4`}
    >
      <div className={`w-full ${track.recent_tracks && track.recent_tracks.length > 0 ? 'max-w-6xl' : 'max-w-2xl'} ${styleClasses.shadow}`}>
        <div className={`${track.recent_tracks && track.recent_tracks.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}`}>
          {/* Main Track Display */}
          <Card className={`${track.recent_tracks && track.recent_tracks.length > 0 ? 'lg:col-span-2' : ''} ${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
            <CardContent className="p-8">
              {/* Vertical stacked layout - everything centered */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Album Art - Largest element at the top */}
                <div className="relative">
                  {albumImage && track.name !== "Loading..." && track.name !== "No recent tracks available" ? (
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
                    <h1 className={`text-3xl font-bold ${track.name === "Loading..." || track.name === "No recent tracks available" ? styleClasses.secondaryText : styleClasses.text}`}>
                      {track.name}
                    </h1>
                  </div>

                  {/* Artist - Under the song title */}
                  <div className={`${styleClasses.secondaryText}`}>
                    <p className="text-xl">
                      {track.artists.map((artist: { name: string }) => artist.name).join(', ')}
                    </p>
                  </div>

                  {/* Album - Under the artist */}
                  <div className={`text-lg ${styleClasses.secondaryText}`}>
                    <p>
                      from <span className="font-medium">{track.album.name}</span>
                    </p>
                  </div>

                  {/* View Counter - Temporarily commented out */}
                  {/* <div className="flex justify-center">
                    <ViewCounter identifier={identifier} />
                  </div> */}

                  {/* Progress and Duration - Under everything else */}
                  {track.name !== "Loading..." && track.name !== "No recent tracks available" && (
                    <div className="space-y-3 w-full">
                      <div className={`w-full ${styleClasses.progressBackground} rounded-full h-2`}>
                        <div
                          className={`${styleClasses.progressBar} h-2 rounded-full transition-all duration-1000 ease-linear`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                      <div className={`flex items-center justify-between text-sm ${styleClasses.secondaryText}`}>
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
                      <span className={`text-sm font-medium ${styleClasses.secondaryText}`}>
                        {track.name === "Loading..." || track.name === "No recent tracks available"
                          ? 'Loading...'
                          : track.is_playing
                            ? 'Now Playing'
                            : track.progress_ms === track.duration_ms
                              ? 'Recently Played'
                              : 'Paused'
                        }
                      </span>
                    </div>
                    <span className={`text-xs ${styleClasses.secondaryText}`}>
                      Updated {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credits Section - only show for real tracks */}
              {currentTrack?.credits && track.name !== "Loading..." && track.name !== "No recent tracks available" && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className={`text-sm font-medium mb-2 ${styleClasses.text}`}>Track Credits</h3>
                  <div className={`space-y-2 text-sm ${styleClasses.secondaryText}`}>
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
                  <p className={`text-xs ${styleClasses.secondaryText}`}>
                    Powered by <span className="font-medium">JamLog</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tracks Sidebar - always show if there are recent tracks */}
          {track.recent_tracks && track.recent_tracks.length > 0 && (
            <Card className={`lg:col-span-1 ${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
              <CardContent className="p-6">
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${styleClasses.text}`}>
                  <Clock className="h-4 w-4 mr-2" />
                  Recently Played
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {track.recent_tracks.map((recentTrack, index) => (
                    <div key={index} className={`group ${styleClasses.hover} p-2 rounded-lg transition-colors`}>
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
                          <p className={`font-medium truncate text-sm leading-tight mb-1 ${styleClasses.text}`}>{recentTrack.name}</p>
                          <p className={`text-xs truncate mb-1 ${styleClasses.secondaryText}`}>
                            {recentTrack.artists.map(artist => artist.name).join(', ')}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs ${styleClasses.secondaryText}`}>
                              {new Date(recentTrack.played_at).toLocaleTimeString()}
                            </p>
                            <a
                              href={recentTrack.external_urls.spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs ${styleClasses.accent} hover:opacity-80 opacity-0 group-hover:opacity-100 transition-opacity`}
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
                  <p className={`text-xs ${styleClasses.secondaryText}`}>
                    Powered by <span className="font-medium">JamLog</span>
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
