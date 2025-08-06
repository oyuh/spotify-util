'use client'

import { DisplayStyleProvider } from '@/contexts/display-style-context'
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper'

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DisplayStyleProvider>
      <AnalyticsWrapper />
      <div className="min-h-screen" data-display-container="true">
        {children}
      </div>
    </DisplayStyleProvider>
  )
}
