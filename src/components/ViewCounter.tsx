'use client'

import { Eye, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useViewTracking } from '@/hooks/use-view-tracking'

interface ViewCounterProps {
  identifier: string
  type?: 'display' | 'stream'
  className?: string
}

export function ViewCounter({ identifier, type = 'display', className = '' }: ViewCounterProps) {
  const { viewStats, isLoading } = useViewTracking(identifier, type)

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
        <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Total Views (30 days) */}
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Eye className="h-3 w-3" />
        <span className="text-xs">{viewStats.viewCount.toLocaleString()}</span>
      </Badge>

      {/* Active Viewers (5 minutes) */}
      {viewStats.activeViewers > 0 && (
        <Badge variant="default" className="flex items-center space-x-1 bg-green-600 hover:bg-green-700">
          <Users className="h-3 w-3" />
          <span className="text-xs">{viewStats.activeViewers}</span>
          <span className="text-xs">live</span>
        </Badge>
      )}
    </div>
  )
}
