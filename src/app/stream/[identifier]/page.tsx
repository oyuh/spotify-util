"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Play, Pause } from "lucide-react"
import { formatDuration, formatProgress, getMediumImage } from "@/lib/utils"
import Image from "next/image"

interface StreamerDisplayProps {
  slug?: string
  spotifyId?: string
}

interface TrackData {
  name: string
  artists?: Array<{ name: string }>
  album?: {
    name: string
    images: Array<{ url: string; height: number; width: number }>
  }
  duration_ms?: number
  is_playing?: boolean
  progress_ms?: number
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
  settings?: {
    theme: string
    customCSS?: string
    streamerMode: boolean
    position?: { x: number; y: number }
  }
}

export default function StreamerPage({ params }: { params: Promise<{ identifier: string }> }) {
  const [trackData, setTrackData] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fakeProgress, setFakeProgress] = useState(0)
  const [lastRealProgress, setLastRealProgress] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const [identifier, setIdentifier] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "current"

  // Get identifier from params
  useEffect(() => {
    params.then(p => setIdentifier(p.identifier))
  }, [params])

  useEffect(() => {
    if (!identifier) return // Wait for identifier to be set

    const fetchTrackData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true)
        }
        setError(null)

        const response = await fetch(`/api/stream/${identifier}`)

        if (!response.ok) {
          throw new Error("Failed to fetch track data")
        }

        const data = await response.json()
        setTrackData(data)

        // Update real progress tracking
        if (data.progress_ms) {
          setLastRealProgress(data.progress_ms)
          setFakeProgress(data.progress_ms)
          setLastUpdateTime(Date.now())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        if (isInitial) {
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchTrackData(true)

    // Refresh every 20 seconds for real data
    const realInterval = setInterval(() => fetchTrackData(false), 20000)

    return () => clearInterval(realInterval)
  }, [identifier, type])

  // Fake progress updates every second for smooth animation
  useEffect(() => {
    if (!trackData?.is_playing || !trackData?.duration_ms) return

    const fakeInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime
      const newFakeProgress = lastRealProgress + timeSinceLastUpdate

      // Only update if we haven't exceeded the track duration
      if (trackData.duration_ms && newFakeProgress < trackData.duration_ms) {
        setFakeProgress(newFakeProgress)
      }
    }, 1000)

    return () => clearInterval(fakeInterval)
  }, [trackData?.is_playing, trackData?.duration_ms, lastRealProgress, lastUpdateTime])

  // Custom CSS injection
  useEffect(() => {
    if (trackData?.settings?.customCSS) {
      const style = document.createElement("style")
      style.textContent = trackData.settings.customCSS
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [trackData?.settings?.customCSS])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !trackData) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Card className="bg-black/80 backdrop-blur-sm border-red-500/50 p-6">
          <div className="text-center text-red-400">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No track data available</p>
            <p className="text-sm opacity-75 mt-1">Check your display settings</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!trackData.name) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Card className="bg-black/80 backdrop-blur-sm border-primary/30 p-6">
          <div className="text-center text-white">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No music playing</p>
            <p className="text-sm opacity-75 mt-1">Start playing on Spotify</p>
          </div>
        </Card>
      </div>
    )
  }

  const albumImage = trackData.album ? getMediumImage(trackData.album.images) : null
  const currentProgress = trackData?.is_playing ? fakeProgress : (trackData?.progress_ms || 0)
  const progress = trackData?.duration_ms
    ? (currentProgress / trackData.duration_ms) * 100
    : 0

  // Position styling for streamer overlay
  const positionStyle = trackData.settings?.position
    ? {
        position: "fixed" as const,
        top: `${trackData.settings.position.y}px`,
        left: `${trackData.settings.position.x}px`,
      }
    : {}

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            background: transparent !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          html {
            background: transparent !important;
          }
          main {
            padding-top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav {
            display: none !important;
          }
          header {
            display: none !important;
          }
          .pt-16 {
            padding-top: 0 !important;
          }
        `
      }} />
      <div className="min-h-screen bg-transparent flex items-start justify-start p-4">
      {/* Clean Streamer Overlay */}
      <div className="bg-transparent border-0 max-w-md w-full">
        <div className="p-0">
          <div className="flex items-center space-x-3">
            {/* Album Art */}
            {albumImage && (
              <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={albumImage}
                  alt={trackData.album?.name || "Album art"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate drop-shadow-lg">
                {trackData.name}
              </h3>

              {trackData.artists && (
                <p className="text-gray-200 text-sm truncate drop-shadow-lg">
                  {trackData.artists.map(artist => artist.name).join(", ")}
                </p>
              )}

              {/* Progress Bar */}
              {trackData.duration_ms && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-black/40 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 drop-shadow-lg">
                    <span>{formatDuration(currentProgress)}</span>
                    <span>{formatDuration(trackData.duration_ms)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credits Section for Stream */}
          {trackData.credits && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="text-xs text-white/80 drop-shadow-lg">
                <div className="mb-1">Track ID: {trackData.credits.track_id}</div>
                <div className="flex gap-1">
                  <a
                    href={trackData.credits.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-green-600/80 text-white text-xs rounded hover:bg-green-700/80 transition-colors"
                  >
                    Track
                  </a>
                  {trackData.credits.album.spotify_url && (
                    <a
                      href={trackData.credits.album.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-600/80 text-white text-xs rounded hover:bg-gray-700/80 transition-colors"
                    >
                      Album
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Tracks Section for Stream */}
          {trackData.recent_tracks && trackData.recent_tracks.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="text-xs text-white/90 drop-shadow-lg mb-2">Recently Played:</div>
              <div className="space-y-2">
                {trackData.recent_tracks.slice(0, 3).map((track, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-black/30 rounded p-2">
                    {track.album.images[0] && (
                      <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={getMediumImage(track.album.images) || track.album.images[0].url}
                          alt={track.album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/90 truncate drop-shadow-lg">{track.name}</p>
                      <p className="text-xs text-white/70 truncate drop-shadow-lg">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        body {
          background: transparent !important;
          margin: 0;
          padding: 0;
        }

        html {
          background: transparent !important;
        }
      `}</style>
    </div>
    </>
  )
}
