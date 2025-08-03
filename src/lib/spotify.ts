const SPOTIFY_BASE_URL = "https://api.spotify.com/v1"

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  external_urls: {
    spotify: string
  }
  preview_url?: string
  explicit: boolean
  popularity: number
}

export interface CurrentlyPlaying {
  item: SpotifyTrack | null
  is_playing: boolean
  progress_ms: number | null
  currently_playing_type: string
  actions: {
    disallows: {
      [key: string]: boolean
    }
  }
}

export interface RecentlyPlayed {
  items: Array<{
    track: SpotifyTrack
    played_at: string
    context?: {
      type: string
      href: string
      external_urls: {
        spotify: string
      }
      uri: string
    }
  }>
  next?: string
  cursors: {
    after: string
    before: string
  }
  limit: number
  href: string
}

class SpotifyAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async makeRequest(endpoint: string, method: string = "GET") {
    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
    try {
      const data = await this.makeRequest("/me/player/currently-playing")
      return data
    } catch (error) {
      console.error("Error fetching currently playing:", error)
      return null
    }
  }

  async getRecentlyPlayed(limit: number = 50): Promise<RecentlyPlayed | null> {
    try {
      const data = await this.makeRequest(`/me/player/recently-played?limit=${limit}`)
      return data
    } catch (error) {
      console.error("Error fetching recently played:", error)
      return null
    }
  }

  async getTrack(trackId: string): Promise<SpotifyTrack | null> {
    try {
      const data = await this.makeRequest(`/tracks/${trackId}`)
      return data
    } catch (error) {
      console.error("Error fetching track:", error)
      return null
    }
  }

  async getTrackCredits(trackId: string) {
    try {
      // Note: This is not available in the public Spotify API
      // You might need to use alternative sources or scraping for track credits
      console.warn("Track credits are not available via public Spotify API")
      return null
    } catch (error) {
      console.error("Error fetching track credits:", error)
      return null
    }
  }

  async getUserProfile() {
    try {
      const data = await this.makeRequest("/me")
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }
}

export async function getSpotifyApi(accessToken: string) {
  if (!accessToken) {
    throw new Error("No access token available")
  }

  return new SpotifyAPI(accessToken)
}

export { SpotifyAPI }
