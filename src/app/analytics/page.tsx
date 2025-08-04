'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, Trophy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TopDisplay {
  identifier: string
  displayName: string
  totalViews: number
  currentViewers: number
  isPublic: boolean
}

export default function LeaderboardPage() {
  const [topDisplays, setTopDisplays] = useState<TopDisplay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopDisplays = async () => {
      try {
        const response = await fetch('/api/analytics/top-views')
        if (response.ok) {
          const data = await response.json()
          setTopDisplays(data.displays || [])
        } else {
          console.error('Failed to fetch top displays')
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopDisplays()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchTopDisplays, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-foreground">SpotifyUtil Leaderboard</h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-muted-foreground">Most popular public display pages</p>
        </div>

        {/* Leaderboard */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Top Public Displays</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topDisplays.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Public Displays Yet</h3>
                <p className="text-muted-foreground mb-4">
                  When users make their displays public, they'll appear here!
                </p>
                <Button asChild>
                  <Link href="/dashboard">Create Your Display</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {topDisplays.map((display, index) => (
                  <div
                    key={display.identifier}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/20 dark:to-amber-950/20 dark:border-yellow-800'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 dark:from-gray-950/20 dark:to-slate-950/20 dark:border-gray-800'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Ranking */}
                      <div className="flex-shrink-0">
                        {index === 0 ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                        ) : index === 1 ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">2</span>
                          </div>
                        ) : index === 2 ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">3</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="font-bold text-muted-foreground">#{index + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Display Info */}
                      <div>
                        <h3 className="font-semibold text-lg">{display.displayName}</h3>
                        <p className="text-sm text-muted-foreground">@{display.identifier}</p>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center space-x-4">
                      {/* View Stats */}
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm">
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">{display.totalViews.toLocaleString()}</span>
                        </div>
                        {display.currentViewers > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-green-600">
                            <Users className="h-3 w-3" />
                            <span className="font-medium">{display.currentViewers}</span>
                            <span>live</span>
                          </div>
                        )}
                      </div>

                      {/* Visit Button */}
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/display/${display.identifier}`}
                          className="flex items-center space-x-1"
                          target="_blank"
                        >
                          <span>Visit</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Leaderboard updates every 30 seconds • View counts are based on the last 30 days
          </p>
        </div>
      </div>
    </div>
  )
}
