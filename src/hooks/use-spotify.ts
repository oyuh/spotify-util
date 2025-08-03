import { useState, useEffect } from "react"
import { SpotifyTrack, CurrentlyPlaying, RecentlyPlayed } from "@/lib/spotify"

export function useCurrentTrack() {
  const [currentTrack, setCurrentTrack] = useState<CurrentlyPlaying | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayProgress, setDisplayProgress] = useState<number>(0)

  useEffect(() => {
    let fetchInterval: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout
    let lastRealProgress = 0
    let lastFetchTime = Date.now()
    let isPlaying = false

    const fetchCurrentTrack = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true)
        }
        setError(null)

        const response = await fetch("/api/spotify/current-track")
        if (!response.ok) {
          throw new Error("Failed to fetch current track")
        }

        const data = await response.json()
        setCurrentTrack(data)

        // Update our local tracking variables
        lastRealProgress = data?.progress_ms || 0
        lastFetchTime = Date.now()
        isPlaying = data?.is_playing || false

        // Set display progress to real progress
        setDisplayProgress(lastRealProgress)

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    }

    const updateDisplayProgress = () => {
      if (isPlaying) {
        const timeSinceLastFetch = Date.now() - lastFetchTime
        const estimatedProgress = lastRealProgress + timeSinceLastFetch
        setDisplayProgress(estimatedProgress)
      }
    }

    // Initial fetch
    fetchCurrentTrack(true)

    // Set up intervals
    fetchInterval = setInterval(() => fetchCurrentTrack(false), 30000) // Every 30 seconds
    progressInterval = setInterval(updateDisplayProgress, 1000) // Every second

    return () => {
      clearInterval(fetchInterval)
      clearInterval(progressInterval)
    }
  }, []) // Empty dependency array - only run once

  // Return track with display progress
  const trackWithProgress = currentTrack ? {
    ...currentTrack,
    progress_ms: displayProgress
  } : null

  return {
    currentTrack: trackWithProgress,
    loading,
    error,
    refetch: () => {} // Can implement if needed
  }
}

export function useRecentTracks(limit: number = 20) {
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentTracks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/spotify/recent-tracks?limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch recent tracks")
      }

      const data = await response.json()
      setRecentTracks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentTracks()
  }, [limit])

  return { recentTracks, loading, error, refetch: fetchRecentTracks }
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/user/preferences")

      if (!response.ok) {
        throw new Error("Failed to fetch preferences")
      }

      const data = await response.json()
      setPreferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: any) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      })

      if (!response.ok) {
        throw new Error("Failed to update preferences")
      }

      await fetchPreferences() // Refresh preferences
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const generateNewSlug = async () => {
    try {
      const response = await fetch("/api/user/generate-slug", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate new slug")
      }

      const data = await response.json()
      return data.slug
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    generateNewSlug,
    refetch: fetchPreferences,
  }
}
