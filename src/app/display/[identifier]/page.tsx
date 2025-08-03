'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Music, Clock, User } from 'lucide-react'
import Image from 'next/image'
import { formatDuration, getMediumImage } from '@/lib/utils'

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
  const [currentTrack, setCurrentTrack] = useState<DisplayTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [fakeProgress, setFakeProgress] = useState(0)
  const [lastRealProgress, setLastRealProgress] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

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
        }
      } catch (error) {
        console.error('Error fetching track:', error)
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
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

  if (!currentTrack || !currentTrack.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No music playing</h3>
            <p className="text-muted-foreground">
              This user isn't currently listening to anything on Spotify.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const track = currentTrack
  const albumImage = getMediumImage(track.album.images)
  const currentProgress = currentTrack?.is_playing ? fakeProgress : (currentTrack?.progress_ms || 0)
  const duration = track.duration_ms
  const progressPercent = (currentProgress / duration) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            {/* Album Art */}
            <div className="relative">
              {albumImage ? (
                <Image
                  src={albumImage}
                  alt={`${track.album.name} cover`}
                  width={120}
                  height={120}
                  className="rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-[120px] h-[120px] bg-muted rounded-lg shadow-lg flex items-center justify-center">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {currentTrack.is_playing && (
                <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse"></div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="space-y-3">
                {/* Track Name */}
                <h1 className="text-2xl font-bold truncate">
                  {track.name}
                </h1>

                {/* Artist(s) */}
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <p className="truncate">
                    {track.artists.map((artist: { name: string }) => artist.name).join(', ')}
                  </p>
                </div>

                {/* Album */}
                <p className="text-muted-foreground truncate">
                  from <span className="font-medium">{track.album.name}</span>
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDuration(currentProgress)}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${currentTrack.is_playing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-muted-foreground">
                      {currentTrack.is_playing ? 'Now playing' : 'Paused'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          {currentTrack.credits && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Track Credits</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
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

          {/* Recent Tracks Section */}
          {currentTrack.recent_tracks && currentTrack.recent_tracks.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Recently Played</h3>
              <div className="space-y-3">
                {currentTrack.recent_tracks.map((track, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    {track.album.images[0] && (
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={getMediumImage(track.album.images) || track.album.images[0].url}
                          alt={track.album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(track.played_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-700 flex-shrink-0"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Powered by */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-medium">SpotifyUtil</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
