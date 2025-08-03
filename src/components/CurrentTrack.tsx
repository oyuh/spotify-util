"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Play, Pause, ExternalLink } from "lucide-react"
import { useCurrentTrack } from "@/hooks/use-spotify"
import { formatDuration, formatProgress, getMediumImage } from "@/lib/utils"
import Image from "next/image"

interface CurrentTrackProps {
  showControls?: boolean
  compact?: boolean
}

export function CurrentTrack({ showControls = false, compact = false }: CurrentTrackProps) {
  const { currentTrack, loading, error, refetch } = useCurrentTrack()

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Failed to load current track</p>
            <p className="text-sm opacity-75 mt-1">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-3">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentTrack?.item) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No track currently playing</p>
            <p className="text-sm mt-2">Start playing music on Spotify to see it here</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-3">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const track = currentTrack.item
  const albumImage = getMediumImage(track.album.images)
  const progress = formatProgress(currentTrack.progress_ms || 0, track.duration_ms)

  if (compact) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {albumImage && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={albumImage}
                  alt={track.album.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant={currentTrack.is_playing ? "default" : "secondary"} className="text-xs">
                  {currentTrack.is_playing ? (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Playing
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Paused
                    </>
                  )}
                </Badge>
              </div>
              <h3 className="font-semibold truncate">{track.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {track.artists.map(artist => artist.name).join(", ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          {/* Album Art */}
          {albumImage && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
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
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant={currentTrack.is_playing ? "default" : "secondary"}>
                {currentTrack.is_playing ? (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Now Playing
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Paused
                  </>
                )}
              </Badge>
              {track.explicit && (
                <Badge variant="outline" className="text-xs">E</Badge>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-1 truncate">{track.name}</h2>
            <p className="text-lg text-muted-foreground mb-2 truncate">
              by {track.artists.map(artist => artist.name).join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mb-4 truncate">
              on {track.album.name}
            </p>

            {/* Progress Bar */}
            {currentTrack.progress_ms && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatDuration(currentTrack.progress_ms)}</span>
                  <span>{formatDuration(track.duration_ms)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            {showControls && (
              <div className="flex space-x-2 mt-4">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in Spotify
                  </a>
                </Button>
                <Button onClick={refetch} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
