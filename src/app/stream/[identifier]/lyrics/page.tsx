"use client"

import { useEffect, useState } from "react"
import { LyricsDisplay } from "@/components/LyricsDisplay"

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
    track_id: string
  }
  preferences?: {
    displaySettings?: {
      style: string
      customCSS?: string
      backgroundImage?: string
      position?: { x: number; y: number }
    }
  }
}

export default function StreamLyricsPage({ params }: { params: Promise<{ identifier: string }> }) {
  const [trackData, setTrackData] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [fakeProgress, setFakeProgress] = useState(0)
  const [lastRealProgress, setLastRealProgress] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

  // Get identifier from params
  useEffect(() => {
    params.then(p => setIdentifier(p.identifier))
  }, [params])

  // Sequential loading function for stream lyrics
  const loadStreamLyricsData = async (data: any) => {
    try {
      console.log('🎵 STREAM LYRICS: Loading track data')
      
      setTrackData(data || {
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false
      })

      // Update progress tracking
      if (data?.progress_ms) {
        setLastRealProgress(data.progress_ms)
        setFakeProgress(data.progress_ms)
        setLastUpdateTime(Date.now())
      }

      setLoading(false)
      console.log('✅ STREAM LYRICS: Track data loaded')
    } catch (err) {
      console.error('Stream lyrics loading error:', err)
      setTrackData({
        name: '',
        artists: [],
        album: { name: '', images: [] },
        is_playing: false
      })
      setLoading(false)
    }
  }

  // Fetch current track data
  useEffect(() => {
    if (!identifier) return

    const fetchTrackData = async () => {
      try {
        console.log('🎵 STREAM LYRICS: Fetching track data for:', identifier)

        let response: Response
        let data: any = null

        // Try as a custom slug first
        response = await fetch(`/api/public/display/${identifier}`)

        if (response.ok) {
          data = await response.json()
          console.log('✅ STREAM LYRICS: Slug endpoint worked!')
        } else if (response.status === 404) {
          // Try as Spotify ID
          response = await fetch(`/api/display/${identifier}`)
          if (response.ok) {
            data = await response.json()
            console.log('✅ STREAM LYRICS: Spotify ID endpoint worked!')
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch track data: ${response.status}`)
        }

        await loadStreamLyricsData(data)

      } catch (err) {
        console.error("Stream lyrics fetch error:", err)
        await loadStreamLyricsData({
          name: '',
          artists: [],
          album: { name: '', images: [] },
          is_playing: false
        })
      }
    }

    // Initial fetch
    fetchTrackData()

    // Update every second for real-time lyrics sync
    const interval = setInterval(fetchTrackData, 1000)

    return () => clearInterval(interval)
  }, [identifier])

  // Fake progress updates for smooth animation between fetches
  useEffect(() => {
    if (!trackData?.is_playing || !trackData?.duration_ms) return

    const fakeInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime
      const newFakeProgress = lastRealProgress + timeSinceLastUpdate

      if (trackData.duration_ms && newFakeProgress < trackData.duration_ms) {
        setFakeProgress(newFakeProgress)
      }
    }, 100) // Update every 100ms for smooth progress

    return () => clearInterval(fakeInterval)
  }, [trackData?.is_playing, trackData?.duration_ms, lastRealProgress, lastUpdateTime])

  // Custom CSS injection for stream lyrics styling
  useEffect(() => {
    if (trackData?.preferences?.displaySettings?.customCSS) {
      const style = document.createElement("style")
      style.textContent = trackData.preferences.displaySettings.customCSS
      style.id = "stream-lyrics-custom-css"
      
      // Remove existing style first
      const existingStyle = document.getElementById("stream-lyrics-custom-css")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
      
      document.head.appendChild(style)

      return () => {
        const existingStyle = document.getElementById("stream-lyrics-custom-css")
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [trackData?.preferences?.displaySettings?.customCSS])

  // Position styling for streamer overlay
  const positionStyle = trackData?.preferences?.displaySettings?.position
    ? {
        position: "fixed" as const,
        top: `${trackData.preferences.displaySettings.position.y}px`,
        left: `${trackData.preferences.displaySettings.position.x}px`,
      }
    : {}

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html {
              background: transparent !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            nav, header {
              display: none !important;
            }
          `
        }} />
        <div className="min-h-screen bg-transparent"></div>
      </>
    )
  }

  if (!trackData || !trackData.name) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html {
              background: transparent !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            nav, header {
              display: none !important;
            }
          `
        }} />
        <div className="min-h-screen bg-transparent"></div>
      </>
    )
  }

  const currentProgress = trackData?.is_playing ? fakeProgress : (trackData?.progress_ms || 0)
  const trackName = trackData.name
  const artistName = trackData.artists?.map(artist => artist.name).join(', ') || ''
  const trackId = trackData.credits?.track_id || ''

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body, html {
            background: transparent !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          nav, header {
            display: none !important;
          }
          .stream-lyrics {
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          }
          .lyrics-line {
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.1);
          }
        `
      }} />
      
      <div 
        className="min-h-screen bg-transparent flex items-start justify-start p-4"
        style={positionStyle}
      >
        <div className="stream-lyrics-container max-w-md w-full">
          <LyricsDisplay
            identifier={identifier || ''}
            trackName={trackName}
            artistName={artistName}
            trackId={trackId}
            progress={currentProgress}
            isPlaying={trackData.is_playing}
            variant="stream"
            className="stream-lyrics-display"
          />
        </div>
      </div>

      <style jsx global>{`
        .stream-lyrics-display {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .stream-lyrics .lyrics-line {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  )
}
