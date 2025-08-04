'use client'

import { useEffect, useState, useRef } from 'react'

interface ViewStats {
  viewCount: number
  activeViewers: number
}

export function useViewTracking(identifier: string, type: 'display' | 'stream' = 'display') {
  const [viewStats, setViewStats] = useState<ViewStats>({ viewCount: 0, activeViewers: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const hasTrackedInitialView = useRef(false)

  useEffect(() => {
    if (!identifier) return

    let interval: NodeJS.Timeout

    const trackInitialView = async () => {
      if (hasTrackedInitialView.current) return
      hasTrackedInitialView.current = true

      try {
        // Record the view only once per page load
        await fetch('/api/analytics/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, type })
        })

        // Get initial stats
        updateStats()
      } catch (error) {
        console.error('Error tracking initial view:', error)
        setIsLoading(false)
      }
    }

    const updateStats = async () => {
      try {
        // Only get stats, don't record a new view
        const response = await fetch(`/api/analytics/view?identifier=${identifier}&type=${type}`)
        if (response.ok) {
          const data = await response.json()
          setViewStats({
            viewCount: data.viewCount || 0,
            activeViewers: data.activeViewers || 0
          })
        }
      } catch (error) {
        console.error('Error updating stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Track initial view
    trackInitialView()

    // Set up interval to update stats every 30 seconds
    interval = setInterval(updateStats, 30000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [identifier, type])

  return { viewStats, isLoading }
}
