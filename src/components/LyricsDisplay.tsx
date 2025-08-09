import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LyricLine {
  startTimeMs: number
  words: string
  isCurrent?: boolean
  isPast?: boolean
  isFuture?: boolean
  index?: number
}

interface LyricsData {
  lyrics: {
    syncType: 'LINE_SYNCED' | 'UNSYNCED' | 'NOT_FOUND'
    lines: LyricLine[]
  }
  colors?: {
    background: number
    text: number
    highlightText: number
  }
  currentProgress: number
  currentLineIndex: number
  nextLineIndex: number
  contextLines: LyricLine[]
  totalLines: number
}

interface LyricsDisplayProps {
  identifier: string
  trackName?: string
  artistName?: string
  trackId?: string
  progress: number
  isPlaying?: boolean
  className?: string
  variant?: 'display' | 'stream'
}

export function LyricsDisplay({
  identifier,
  trackName = '',
  artistName = '',
  trackId = '',
  progress = 0,
  isPlaying = false,
  className = '',
  variant = 'display'
}: LyricsDisplayProps) {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch lyrics data
  useEffect(() => {
    if (!trackName && !trackId) {
      setLyricsData(null)
      setLoading(false)
      return
    }

    const fetchLyrics = async () => {
      try {
        setError(null)
        
        const params = new URLSearchParams({
          track: trackName,
          artist: artistName,
          progress: progress.toString()
        })
        
        if (trackId) {
          params.set('trackId', trackId)
        }

        const response = await fetch(`/api/lyrics/${identifier}?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch lyrics')
        }
        
        const data = await response.json()
        setLyricsData(data)
        setLoading(false)
      } catch (err) {
        console.error('Lyrics fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchLyrics()
    
    // Update lyrics every second when playing
    let interval: NodeJS.Timeout | null = null
    if (isPlaying) {
      interval = setInterval(fetchLyrics, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [identifier, trackName, artistName, trackId, progress, isPlaying])

  if (loading) {
    return (
      <div className={cn('lyrics-container', className)}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-sm opacity-60">
            Loading lyrics...
          </div>
        </div>
      </div>
    )
  }

  if (error || !lyricsData) {
    return (
      <div className={cn('lyrics-container', className)}>
        <div className="flex items-center justify-center h-32">
          <div className="text-sm opacity-40">
            {error || 'No lyrics available'}
          </div>
        </div>
      </div>
    )
  }

  if (lyricsData.lyrics.syncType === 'NOT_FOUND') {
    return (
      <div className={cn('lyrics-container', className)}>
        <div className="flex items-center justify-center h-32">
          <div className="text-sm opacity-40">
            No lyrics found for this track
          </div>
        </div>
      </div>
    )
  }

  const isStreamVariant = variant === 'stream'
  const baseTextSize = isStreamVariant ? 'text-sm' : 'text-base'
  const currentTextSize = isStreamVariant ? 'text-base' : 'text-lg'

  return (
    <div className={cn(
      'lyrics-container',
      isStreamVariant ? 'stream-lyrics' : 'display-lyrics',
      className
    )}>
      {/* Lyrics Lines */}
      <div className="lyrics-lines space-y-2">
        {lyricsData.contextLines.map((line) => (
          <div
            key={`${line.index}-${line.startTimeMs}`}
            className={cn(
              'lyrics-line transition-all duration-300 px-2 py-1 rounded',
              {
                // Current line - highlighted
                [cn(
                  currentTextSize,
                  'font-semibold text-white bg-white/10 shadow-sm',
                  isStreamVariant ? 'drop-shadow-lg' : ''
                )]: line.isCurrent,
                
                // Past lines - dimmed
                [cn(
                  baseTextSize,
                  'opacity-50 text-white/70'
                )]: line.isPast,
                
                // Future lines - normal
                [cn(
                  baseTextSize,
                  'opacity-80 text-white/90'
                )]: line.isFuture,
                
                // Empty lines
                'min-h-[1.5rem]': !line.words.trim()
              }
            )}
          >
            {line.words || '\u00A0'} {/* Non-breaking space for empty lines */}
          </div>
        ))}
      </div>

      {/* Progress indicator for stream variant */}
      {isStreamVariant && lyricsData.lyrics.syncType === 'LINE_SYNCED' && (
        <div className="lyrics-progress mt-4 text-xs opacity-60">
          {lyricsData.currentLineIndex + 1} / {lyricsData.totalLines}
        </div>
      )}

      {/* Lyrics type indicator */}
      <div className="lyrics-meta mt-3 text-xs opacity-40">
        {lyricsData.lyrics.syncType === 'LINE_SYNCED' ? (
          <span className="text-green-400">♪ Synchronized</span>
        ) : (
          <span className="text-yellow-400">♪ Static</span>
        )}
      </div>
    </div>
  )
}
