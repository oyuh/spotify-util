'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { displayStyles, type DisplayStyle } from '@/lib/app-themes'
import { Play, Pause, SkipForward, Volume2, ExternalLink, Copy, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeTesterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for the preview
const mockTrack = {
  name: "T.N.T",
  artist: "AC/DC",
  album: "High Voltage",
  albumArt: "https://i.scdn.co/image/ab67616d0000b273286a0837ff3424065a735e0a",
  duration: 200000,
  progress: 120000,
  isPlaying: true
}

const mockRecentTracks = [
  {
  name: "T.N.T",
  artist: "AC/DC",
    played_at: "2024-01-01T12:00:00Z"
  },
  {
  name: "T.N.T",
  artist: "AC/DC",
    played_at: "2024-01-01T11:45:00Z"
  },
  {
  name: "T.N.T",
  artist: "AC/DC",
    played_at: "2024-01-01T11:30:00Z"
  }
]

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function ThemePreview({ style, isSelected }: { style: DisplayStyle; isSelected: boolean }) {
  const [copied, setCopied] = useState(false)

  const progressPercentage = (mockTrack.progress / mockTrack.duration) * 100

  const handleCopyCSS = async () => {
    if (style.customCSS) {
      await navigator.clipboard.writeText(style.customCSS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden transition-all duration-300",
      isSelected && "ring-2 ring-primary ring-offset-2"
    )}>
      {/* Apply the theme's background - this mimics the actual display page */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center p-4",
        style.styles.background,
        style.styles.fontFamily
      )}>
        {/* Apply custom CSS if available */}
        {style.customCSS && (
          <style dangerouslySetInnerHTML={{ __html: style.customCSS }} />
        )}

        {/* Display page layout - matches actual /display/[identifier] page */}
        <div className="w-full max-w-2xl">
          <div className={cn(
            "p-8",
            style.styles.cardBackground,
            style.styles.cardBorder,
            style.styles.shadow,
            style.styles.borderRadius
          )}>
            {/* Vertical stacked layout - everything centered like the real display page */}
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Album Art - Largest element at the top */}
              <div className="relative">
                <div className="w-[240px] h-[240px] rounded-xl shadow-xl overflow-hidden">
                  <img
                    src={mockTrack.albumArt}
                    alt={mockTrack.album}
                    className="w-full h-full object-cover"
                  />
                </div>
                {mockTrack.isPlaying && (
                  <div className="absolute inset-0 rounded-xl border-3 border-primary animate-pulse"></div>
                )}
              </div>

              {/* Track Info - Stacked vertically below the image */}
              <div className="w-full space-y-4 max-w-md">
                {/* Song Title - Directly under the image */}
                <div>
                  <h1 className={cn(
                    "text-3xl font-bold",
                    style.styles.text,
                    style.customCSS?.includes('glow-text') && 'glow-text',
                    style.customCSS?.includes('retro-glow') && 'retro-glow',
                    style.customCSS?.includes('cyber-glow') && 'cyber-glow',
                    style.customCSS?.includes('matrix-text') && 'matrix-text'
                  )}>
                    {mockTrack.name}
                  </h1>
                </div>

                {/* Artist - Under the song title */}
                <div className={style.styles.secondaryText}>
                  <p className="text-xl">
                    {mockTrack.artist}
                  </p>
                </div>

                {/* Album - Under the artist */}
                <div className={cn("text-lg", style.styles.secondaryText)}>
                  <p>
                    from <span className="font-medium">{mockTrack.album}</span>
                  </p>
                </div>

                {/* Progress and Duration - Under everything else */}
                <div className="space-y-3 w-full">
                  <div className={cn("w-full rounded-full h-2", style.styles.progressBackground)}>
                    <div
                      className={cn("h-2 rounded-full transition-all duration-1000 ease-linear", style.styles.progressBar)}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className={cn("flex items-center justify-between text-sm", style.styles.secondaryText)}>
                    <span>{formatTime(mockTrack.progress)}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(mockTrack.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Status - At the bottom */}
                <div className="flex flex-col items-center space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${mockTrack.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={cn("text-sm font-medium", style.styles.secondaryText)}>
                      {mockTrack.isPlaying ? 'Now Playing' : 'Recently Played'}
                    </span>
                  </div>
                  <span className={cn("text-xs", style.styles.secondaryText)}>
                    Updated {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Powered by - at the bottom */}
            <div className="mt-6 pt-4 border-t text-center">
              <p className={cn("text-xs", style.styles.secondaryText)}>
                Powered by <span className="font-medium">JamLog</span>
              </p>
            </div>
          </div>
        </div>

        {/* Theme info overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {style.category}
          </Badge>
          {style.customCSS && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCSS}
              className="h-6 px-2 text-xs"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}export function ThemeTester({ open, onOpenChange }: ThemeTesterProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(displayStyles[0].id)
  const [currentCategory, setCurrentCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Themes' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'modern', name: 'Modern' },
    { id: 'neon', name: 'Neon' },
    { id: 'retro', name: 'Retro' },
    { id: 'spotify', name: 'Spotify' },
    { id: 'nature', name: 'Nature' }
  ]

  const filteredStyles = currentCategory === 'all'
    ? displayStyles
    : displayStyles.filter((style: DisplayStyle) => style.category === currentCategory)

  const selectedStyle = displayStyles.find((style: DisplayStyle) => style.id === selectedTheme) || displayStyles[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[10vw] h-[95vh] max-w-none p-0 m-0" style={{ width: '70vw', maxWidth: 'none' }}>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Theme Tester</DialogTitle>
          <DialogDescription>
            Preview all available themes for your stream display. Click on any theme to see it in action!
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="h-full">
            {/* Category Tabs */}
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-7">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 h-full">
              <div className="grid grid-cols-4 gap-8 h-[750px]">
                {/* Theme List - Takes up 1/4 of space */}
                <div className="col-span-1 space-y-4">
                  <h3 className="font-semibold text-lg">Available Themes ({filteredStyles.length})</h3>
                  <ScrollArea className="h-[700px]">
                    <div className="space-y-3 pr-4">
                      {filteredStyles.map((style: DisplayStyle) => (
                        <Card
                          key={style.id}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-md",
                            selectedTheme === style.id && "ring-2 ring-primary ring-offset-2"
                          )}
                          onClick={() => setSelectedTheme(style.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                              {/* Theme preview color */}
                              <div
                                className="w-8 h-8 rounded-lg flex-shrink-0"
                                style={{ background: style.preview }}
                              />

                              {/* Theme info */}
                              <div className="flex-1 min-w-0">
                                <div className="mb-1">
                                  <h4 className="font-medium truncate text-sm">{style.name}</h4>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {style.category}
                                  </Badge>
                                </div>

                                {/* Features */}
                                <div className="flex gap-1 mt-1">
                                  {style.customCSS && (
                                    <Badge variant="secondary" className="text-xs">CSS</Badge>
                                  )}
                                </div>
                              </div>

                              {selectedTheme === style.id && (
                                <div className="flex-shrink-0">
                                  <Badge variant="default" className="text-xs">Active</Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Live Preview - Takes up 3/4 of space */}
                <div className="col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Live Preview - Display Page Layout</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/stream/demo?theme=${selectedTheme}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Full Preview
                      </Button>
                    </div>
                  </div>

                  <div className="h-[700px] border rounded-lg overflow-hidden">
                    <ThemePreview
                      style={selectedStyle}
                      isSelected={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
