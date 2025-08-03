"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, ExternalLink, Clock } from "lucide-react"
import { useRecentTracks } from "@/hooks/use-spotify"
import { formatDuration, getMediumImage } from "@/lib/utils"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface RecentTracksProps {
  limit?: number
  showHeader?: boolean
  compact?: boolean
}

export function RecentTracks({ limit = 20, showHeader = true, compact = false }: RecentTracksProps) {
  const { recentTracks, loading, error, refetch } = useRecentTracks(limit)

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Recently Played</CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        {showHeader && (
          <CardHeader>
            <CardTitle>Recently Played</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center text-destructive py-8">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Failed to load recent tracks</p>
            <p className="text-sm opacity-75 mt-1">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-3">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recentTracks?.items || recentTracks.items.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Recently Played</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No recent tracks found</p>
            <p className="text-sm mt-2">Your recently played tracks will appear here</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-3">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Played</CardTitle>
          <Button onClick={refetch} variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className={`space-y-${compact ? "2" : "4"}`}>
          {recentTracks.items.map((item, index) => {
            const track = item.track
            const albumImage = getMediumImage(track.album.images)
            const playedAt = new Date(item.played_at)

            return (
              <div
                key={`${track.id}-${item.played_at}`}
                className={`flex items-center space-x-${compact ? "3" : "4"} group hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors`}
              >
                {/* Track Number */}
                <div className="text-sm text-muted-foreground w-6 text-center">
                  {index + 1}
                </div>

                {/* Album Art */}
                {albumImage && (
                  <div className={`relative ${compact ? "w-10 h-10" : "w-12 h-12"} rounded-lg overflow-hidden flex-shrink-0`}>
                    <Image
                      src={albumImage}
                      alt={track.album.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium truncate ${compact ? "text-sm" : ""}`}>
                      {track.name}
                    </h3>
                    {track.explicit && (
                      <Badge variant="outline" className="text-xs">E</Badge>
                    )}
                  </div>
                  <p className={`text-muted-foreground truncate ${compact ? "text-xs" : "text-sm"}`}>
                    {track.artists.map(artist => artist.name).join(", ")}
                  </p>
                  {!compact && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {track.album.name}
                    </p>
                  )}
                </div>

                {/* Duration & Time */}
                <div className="text-right space-y-1 flex-shrink-0">
                  <div className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>
                    {formatDuration(track.duration_ms)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(playedAt, { addSuffix: true })}
                  </div>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        {recentTracks.items.length === limit && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={refetch}>
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
