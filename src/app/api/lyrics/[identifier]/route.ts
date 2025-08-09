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

// Musixmatch API (free tier - 2000 requests/day)
async function fetchLyricsFromMusixmatch(trackName: string, artistName: string): Promise<LyricsResponse | null> {
  try {
    const apiKey = process.env.MUSIXMATCH_API_KEY
    if (!apiKey) {
      console.log('⚠️ MUSIXMATCH_API_KEY not found, skipping Musixmatch')
      return null
    }
    
    // Clean track and artist names
    const cleanTrack = encodeURIComponent(trackName.replace(/\s*\(.*?\)\s*/g, '').trim())
    const cleanArtist = encodeURIComponent(artistName.split(',')[0].trim())
    
    console.log(`🎵 MUSIXMATCH: Searching for "${cleanTrack}" by "${cleanArtist}"`)
    
    // Step 1: Search for the track
    const searchUrl = `https://api.musixmatch.com/ws/1.1/track.search?format=json&callback=callback&q_track=${cleanTrack}&q_artist=${cleanArtist}&apikey=${apiKey}&s_track_rating=desc&page_size=1`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()
    
    if (!searchData.message?.body?.track_list?.length) {
      console.log('🎵 MUSIXMATCH: No tracks found')
      return null
    }
    
    const track = searchData.message.body.track_list[0].track
    const trackId = track.track_id
    
    console.log(`🎵 MUSIXMATCH: Found track ID ${trackId}`)
    
    // Step 2: Get lyrics for the track
    const lyricsUrl = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&callback=callback&track_id=${trackId}&apikey=${apiKey}`
    
    const lyricsResponse = await fetch(lyricsUrl)
    const lyricsData = await lyricsResponse.json()
    
    if (!lyricsData.message?.body?.lyrics) {
      console.log('🎵 MUSIXMATCH: No lyrics found')
      return null
    }
    
    const lyricsBody = lyricsData.message.body.lyrics.lyrics_body
    if (!lyricsBody || lyricsBody.includes('******* This Lyrics is NOT for Commercial use *******')) {
      console.log('🎵 MUSIXMATCH: Lyrics restricted or empty')
      return null
    }
    
    // Convert plain lyrics to synchronized format (basic timing)
    const lines = lyricsBody.split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string, index: number): LyricLine => ({
        startTimeMs: index * 4000, // 4 seconds per line
        words: line.trim()
      }))
    
    console.log(`🎵 MUSIXMATCH: Successfully parsed ${lines.length} lines`)
    
    return {
      lyrics: {
        syncType: 'UNSYNCED', // Musixmatch free tier doesn't include timing
        lines
      },
      colors: {
        background: 0x000000,
        text: 0xFFFFFF,
        highlightText: 0x1DB954
      },
      language: 'en',
      isRtlLanguage: false,
      isExplicit: track.explicit === 1
    }
    
  } catch (error) {
    console.error('🎵 MUSIXMATCH ERROR:', error)
    return null
  }
}

// Genius API (free tier with rate limits)
async function fetchLyricsFromGenius(trackName: string, artistName: string): Promise<LyricsResponse | null> {
  try {
    const accessToken = process.env.GENIUS_ACCESS_TOKEN
    if (!accessToken) {
      console.log('⚠️ GENIUS_ACCESS_TOKEN not found, skipping Genius')
      return null
    }
    
    const query = encodeURIComponent(`${trackName} ${artistName}`)
    const searchUrl = `https://api.genius.com/search?q=${query}`
    
    console.log(`🎵 GENIUS: Searching for "${trackName}" by "${artistName}"`)
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'JamLog/1.0'
      }
    })
    
    if (!response.ok) {
      console.log('🎵 GENIUS: API request failed:', response.status)
      return null
    }
    
    const data = await response.json()
    
    if (!data.response?.hits?.length) {
      console.log('🎵 GENIUS: No songs found')
      return null
    }
    
    const song = data.response.hits[0].result
    console.log(`🎵 GENIUS: Found "${song.title}" by ${song.primary_artist.name}`)
    
    // Note: Genius doesn't provide lyrics content in API, only metadata
    // We'd need web scraping for actual lyrics, which violates their ToS
    // So we'll return a placeholder indicating where lyrics would go
    
    return {
      lyrics: {
        syncType: 'NOT_FOUND',
        lines: [
          { startTimeMs: 0, words: '♪ Lyrics available on Genius.com ♪' },
          { startTimeMs: 5000, words: `"${song.title}" by ${song.primary_artist.name}` },
          { startTimeMs: 10000, words: 'Visit the link to view full lyrics' }
        ]
      },
      colors: {
        background: 0xFFFF00,
        text: 0x000000,
        highlightText: 0x000000
      }
    }
    
  } catch (error) {
    console.error('🎵 GENIUS ERROR:', error)
    return null
  }
}

// LyricsFind API (premium service with sync data)
async function fetchLyricsFromLyricsFind(trackName: string, artistName: string): Promise<LyricsResponse | null> {
  try {
    const apiKey = process.env.LYRICSFIND_API_KEY
    const userId = process.env.LYRICSFIND_USER_ID
    
    if (!apiKey || !userId) {
      console.log('⚠️ LyricsFind credentials not found, skipping')
      return null
    }
    
    const baseUrl = 'https://api.lyricsfind.com/lyric.do'
    const params = new URLSearchParams({
      apikey: apiKey,
      reqtype: 'default',
      format: 'json',
      userid: userId,
      artist: artistName,
      title: trackName,
      output: 'dtq' // Get timed lyrics
    })
    
    console.log(`🎵 LYRICSFIND: Searching for "${trackName}" by "${artistName}"`)
    
    const response = await fetch(`${baseUrl}?${params}`)
    const data = await response.json()
    
    if (data.response.code !== 101) {
      console.log('🎵 LYRICSFIND: No lyrics found, code:', data.response.code)
      return null
    }
    
    const lyricsData = data.response.lyrics
    if (!lyricsData) return null
    
    // Parse synchronized lyrics if available
    if (lyricsData.dtq) {
      const lines: LyricLine[] = lyricsData.dtq.split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => {
          const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/)
          if (match) {
            const minutes = parseInt(match[1])
            const seconds = parseInt(match[2])
            const milliseconds = parseInt(match[3]) * 10
            const text = match[4].trim()
            
            return {
              startTimeMs: (minutes * 60 + seconds) * 1000 + milliseconds,
              words: text
            }
          }
          return { startTimeMs: 0, words: line.trim() }
        })
        .filter((line: LyricLine) => line.words.length > 0)
      
      return {
        lyrics: {
          syncType: 'LINE_SYNCED',
          lines
        },
        colors: {
          background: 0x000000,
          text: 0xFFFFFF,
          highlightText: 0x1DB954
        },
        isExplicit: lyricsData.explicit === 1
      }
    }
    
    return null
    
  } catch (error) {
    console.error('🎵 LYRICSFIND ERROR:', error)
    return null
  }
}

// Enhanced mock lyrics with more realistic content
function getMockLyrics(trackName: string, artistName: string): LyricsResponse {
  // Create more realistic mock lyrics based on common song patterns
  const mockLines: LyricLine[] = [
    { startTimeMs: 0, words: '' },
    { startTimeMs: 2000, words: `♪ ${trackName} ♪` },
    { startTimeMs: 4000, words: `by ${artistName}` },
    { startTimeMs: 8000, words: '' },
    { startTimeMs: 12000, words: 'Verse 1:' },
    { startTimeMs: 15000, words: 'This is where the story begins' },
    { startTimeMs: 19000, words: 'Every beat and every melody' },
    { startTimeMs: 23000, words: 'Dancing through the rhythm of time' },
    { startTimeMs: 27000, words: 'Music speaks what words cannot say' },
    { startTimeMs: 31000, words: '' },
    { startTimeMs: 33000, words: 'Chorus:' },
    { startTimeMs: 35000, words: 'Feel the music in your soul' },
    { startTimeMs: 39000, words: 'Let it take you where you need to go' },
    { startTimeMs: 43000, words: 'Every note a story told' },
    { startTimeMs: 47000, words: 'This is how we lose control' },
    { startTimeMs: 51000, words: '' },
    { startTimeMs: 55000, words: 'Verse 2:' },
    { startTimeMs: 58000, words: 'Underneath the starlit sky' },
    { startTimeMs: 62000, words: 'We find harmony in chaos' },
    { startTimeMs: 66000, words: 'Every heartbeat synchronized' },
    { startTimeMs: 70000, words: 'With the universe around us' },
    { startTimeMs: 74000, words: '' },
    { startTimeMs: 76000, words: 'Chorus:' },
    { startTimeMs: 78000, words: 'Feel the music in your soul' },
    { startTimeMs: 82000, words: 'Let it take you where you need to go' },
    { startTimeMs: 86000, words: 'Every note a story told' },
    { startTimeMs: 90000, words: 'This is how we lose control' },
    { startTimeMs: 94000, words: '' },
    { startTimeMs: 98000, words: 'Bridge:' },
    { startTimeMs: 100000, words: 'When words fail, music speaks' },
    { startTimeMs: 104000, words: 'In every silence, rhythm seeks' },
    { startTimeMs: 108000, words: 'A way to touch the human heart' },
    { startTimeMs: 112000, words: 'Music is where healing starts' },
    { startTimeMs: 116000, words: '' },
    { startTimeMs: 120000, words: 'Final Chorus:' },
    { startTimeMs: 122000, words: 'Feel the music in your soul' },
    { startTimeMs: 126000, words: 'Let it take you where you need to go' },
    { startTimeMs: 130000, words: 'Every note a story told' },
    { startTimeMs: 134000, words: 'This is how we lose control' },
    { startTimeMs: 138000, words: '' },
    { startTimeMs: 142000, words: '🎵 [Instrumental outro] 🎵' },
    { startTimeMs: 150000, words: '' },
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

    // Try multiple sources in order of preference (best to worst quality)
    
    // 1. LyricsFind (premium, has sync data)
    if (trackName && artistName) {
      lyricsData = await fetchLyricsFromLyricsFind(trackName, artistName)
      if (lyricsData) console.log('✅ Using LyricsFind data')
    }
    
    // 2. Musixmatch (free tier, no sync but has lyrics)
    if (!lyricsData && trackName && artistName) {
      lyricsData = await fetchLyricsFromMusixmatch(trackName, artistName)
      if (lyricsData) console.log('✅ Using Musixmatch data')
    }
    
    // 3. Genius (metadata only, no lyrics content)
    if (!lyricsData && trackName && artistName) {
      lyricsData = await fetchLyricsFromGenius(trackName, artistName)
      if (lyricsData) console.log('✅ Using Genius data')
    }

    // 4. Fallback to enhanced mock lyrics
    if (!lyricsData) {
      console.log('🎵 LYRICS API: Using enhanced mock lyrics for development')
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
    const startIndex = Math.max(0, currentLineIndex - 2) // Show 2 lines before
    const endIndex = Math.min(lyricsData.lyrics.lines.length, currentLineIndex + 5) // Show 5 lines after

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
      totalLines: lyricsData.lyrics.lines.length,
      apiSource: lyricsData.lyrics.syncType === 'LINE_SYNCED' ? 'premium' : 'free'
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
