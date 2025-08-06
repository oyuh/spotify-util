"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Play, Pause } from "lucide-react"
import { formatDuration, formatProgress, getMediumImage } from "@/lib/utils"
import { ScrollingText } from "@/components/ScrollingText"
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
    backgroundImage?: string
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

        // The API now handles recent tracks fallback, so we just use the data as-is
        setTrackData(data || {
          name: '',
          artists: [],
          album: { name: '', images: [] },
          is_playing: false
        })

        // Update real progress tracking
        if (data.progress_ms) {
          setLastRealProgress(data.progress_ms)
          setFakeProgress(data.progress_ms)
          setLastUpdateTime(Date.now())
        }
      } catch (err) {
        console.error("Stream fetch error:", err)
        // For stream overlay, don't show errors - just set empty state
        setTrackData({
          name: '',
          artists: [],
          album: { name: '', images: [] },
          is_playing: false
        })
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

  // Custom CSS injection for stream page styling only
  useEffect(() => {
    if (trackData?.settings?.customCSS) {
      const style = document.createElement("style")
      style.textContent = trackData.settings.customCSS
      style.id = "stream-custom-css"
      document.head.appendChild(style)

      return () => {
        const existingStyle = document.getElementById("stream-custom-css")
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [trackData?.settings?.customCSS])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent"></div>
    )
  }

  if (!trackData || !trackData.name) {
    // Don't show anything for stream overlay when no track is available
    // This prevents showing error messages on the stream
    return (
      <div className="min-h-screen bg-transparent"></div>
    )
  }

  // We've removed the "No music playing" message since we want to show the last played track
  // when nothing is currently playing

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
      <div className="bg-transparent border-0 max-w-xs w-full stream-container">
        <div className="p-0 stream-card">
          <div className="flex items-center space-x-3">
            {/* Album Art */}
            {albumImage && (
              <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-lg album-art">
                <Image
                  src={albumImage}
                  alt={trackData.album?.name || "Album art"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Track Info */}
            <div className="flex-1 min-w-0 track-info">
              <div className="font-bold text-white text-base drop-shadow-lg flex items-center track-title">
                {!trackData.is_playing && (
                  <Pause className="h-4 w-4 mr-1 text-white/70 flex-shrink-0" aria-label="Not playing" />
                )}
                <ScrollingText
                  text={trackData.name}
                  className="flex-1"
                  speed={40}
                  pauseDuration={2000}
                />
              </div>

              {trackData.artists && (
                <ScrollingText
                  text={trackData.artists.map(artist => artist.name).join(", ")}
                  className="text-gray-200 text-sm drop-shadow-lg track-artist"
                  speed={35}
                  pauseDuration={2000}
                />
              )}

              {/* Progress Bar */}
              {trackData.duration_ms && (
                <div className="mt-2 space-y-1 track-progress">
                  <div className="w-full bg-black/40 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 drop-shadow-lg track-duration">
                    <span>{formatDuration(currentProgress)}</span>
                    <span>{formatDuration(trackData.duration_ms)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credits Section for Stream */}
          {trackData.credits && (
            <div className="mt-3 pt-2 border-t border-white/20 track-credits">
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
            <div className="mt-3 pt-2 border-t border-white/20 recent-tracks">
              <div className="text-xs text-white/90 drop-shadow-lg mb-2">Recently Played:</div>
              <div className="space-y-2">
                {trackData.recent_tracks.slice(0, 3).map((track, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-black/30 rounded p-2 recent-track-item">
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
                      <ScrollingText
                        text={track.name}
                        className="text-xs text-white/90 drop-shadow-lg"
                        speed={25}
                        pauseDuration={1500}
                      />
                      <ScrollingText
                        text={track.artists.map(artist => artist.name).join(', ')}
                        className="text-xs text-white/70 drop-shadow-lg"
                        speed={25}
                        pauseDuration={1500}
                      />
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
