import { NextRequest, NextResponse } from 'next/server'

interface LyricLine {
  startTimeMs: number
  words: string
  syllables?: Array<{
    text: string
    startTimeMs: number
    endTimeMs: number
  }>
}

interface LyricsResponse {
  lyrics: {
    syncType: 'LINE_SYNCED' | 'UNSYNCED' | 'NOT_FOUND'
    lines: LyricLine[]
  }
  colors?: {
    background: number
    text: number
    highlightText: number
  }
  language?: string
  isRtlLanguage?: boolean
  isExplicit?: boolean
}

// Spotify Web API doesn't provide lyrics, so we'll use multiple fallback services
async function fetchLyricsFromSpotify(trackId: string, market: string = 'US'): Promise<LyricsResponse | null> {
  // This is a placeholder - Spotify doesn't officially provide lyrics API
  // In a real implementation, you'd need to use undocumented endpoints or other services
  return null
}

// Musixmatch API (requires API key)
async function fetchLyricsFromMusixmatch(trackName: string, artistName: string): Promise<LyricsResponse | null> {
  try {
    // This would require a Musixmatch API key
    // const apiKey = process.env.MUSIXMATCH_API_KEY
    // if (!apiKey) return null
    
    // For now, return null - you'd implement the actual API call here
    return null
  } catch (error) {
    console.error('Musixmatch lyrics fetch error:', error)
    return null
  }
}

// Genius API (for unsynchronized lyrics as fallback)
async function fetchLyricsFromGenius(trackName: string, artistName: string): Promise<LyricsResponse | null> {
  try {
    // This would require a Genius API key
    // const apiKey = process.env.GENIUS_ACCESS_TOKEN
    // if (!apiKey) return null
    
    // For now, return null - you'd implement the actual API call here
    return null
  } catch (error) {
    console.error('Genius lyrics fetch error:', error)
    return null
  }
}

// Mock lyrics for development/testing
function getMockLyrics(trackName: string, artistName: string): LyricsResponse {
  // Generate mock synchronized lyrics for testing
  const mockLines: LyricLine[] = [
    { startTimeMs: 0, words: '' }, // Empty line at start
    { startTimeMs: 5000, words: `♪ ${trackName} ♪` },
    { startTimeMs: 10000, words: `by ${artistName}` },
    { startTimeMs: 15000, words: '' },
    { startTimeMs: 20000, words: 'This is a sample lyric line' },
    { startTimeMs: 25000, words: 'With synchronized timing data' },
    { startTimeMs: 30000, words: 'Perfect for karaoke-style display' },
    { startTimeMs: 35000, words: '' },
    { startTimeMs: 40000, words: 'Each line appears at the right time' },
    { startTimeMs: 45000, words: 'Based on the current track progress' },
    { startTimeMs: 50000, words: 'Creating a smooth lyric experience' },
    { startTimeMs: 55000, words: '' },
    { startTimeMs: 60000, words: '🎵 Music continues... 🎵' },
  ]

  return {
    lyrics: {
      syncType: 'LINE_SYNCED',
      lines: mockLines
    },
    colors: {
      background: 0x000000,
      text: 0xFFFFFF,
      highlightText: 0x1DB954 // Spotify green
    },
    language: 'en',
    isRtlLanguage: false,
    isExplicit: false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params
    const { searchParams } = new URL(request.url)
    const trackName = searchParams.get('track') || ''
    const artistName = searchParams.get('artist') || ''
    const trackId = searchParams.get('trackId') || ''
    const progress = parseInt(searchParams.get('progress') || '0')

    console.log(`🎵 LYRICS API: Fetching lyrics for "${trackName}" by "${artistName}"`)

    let lyricsData: LyricsResponse | null = null

    // Try multiple sources in order of preference
    if (trackId) {
      lyricsData = await fetchLyricsFromSpotify(trackId)
    }
    
    if (!lyricsData && trackName && artistName) {
      lyricsData = await fetchLyricsFromMusixmatch(trackName, artistName)
    }
    
    if (!lyricsData && trackName && artistName) {
      lyricsData = await fetchLyricsFromGenius(trackName, artistName)
    }

    // Fallback to mock lyrics for development
    if (!lyricsData) {
      console.log('🎵 LYRICS API: Using mock lyrics for development')
      lyricsData = getMockLyrics(trackName || 'Unknown Track', artistName || 'Unknown Artist')
    }

    // Find current and upcoming lyrics based on progress
    const currentTime = progress
    let currentLineIndex = -1
    let nextLineIndex = -1

    for (let i = 0; i < lyricsData.lyrics.lines.length; i++) {
      const line = lyricsData.lyrics.lines[i]
      if (line.startTimeMs <= currentTime) {
        currentLineIndex = i
      } else {
        nextLineIndex = i
        break
      }
    }

    // Get context lines (previous, current, next few lines)
    const contextLines = []
    const startIndex = Math.max(0, currentLineIndex - 1)
    const endIndex = Math.min(lyricsData.lyrics.lines.length, currentLineIndex + 4)

    for (let i = startIndex; i < endIndex; i++) {
      const line = lyricsData.lyrics.lines[i]
      contextLines.push({
        ...line,
        isCurrent: i === currentLineIndex,
        isPast: i < currentLineIndex,
        isFuture: i > currentLineIndex,
        index: i
      })
    }

    const response = {
      ...lyricsData,
      currentProgress: currentTime,
      currentLineIndex,
      nextLineIndex,
      contextLines,
      totalLines: lyricsData.lyrics.lines.length
    }

    console.log(`🎵 LYRICS API: Returning ${lyricsData.lyrics.lines.length} lines, current: ${currentLineIndex}`)
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('Lyrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lyrics' },
      { status: 500 }
    )
  }
}
