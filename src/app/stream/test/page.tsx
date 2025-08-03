'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StreamerTest() {
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading a track for demo
    setTimeout(() => {
      setCurrentTrack({
        name: "Test Song",
        artists: [{ name: "Test Artist" }],
        album: {
          name: "Test Album",
          images: [{ url: "/next.svg" }]
        },
        is_playing: true
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-4">
      <Card className="w-96 bg-black/80 border-primary/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">
                {currentTrack?.name}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {currentTrack?.artists?.[0]?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentTrack?.album?.name}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant={currentTrack?.is_playing ? "default" : "secondary"}>
              {currentTrack?.is_playing ? "🎵 Now Playing" : "⏸️ Paused"}
            </Badge>
            <div className="text-xs text-gray-500">
              Live from Spotify
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
