'use client'

import { DisplayStyleProvider } from '@/contexts/display-style-context-v2'
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper'

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DisplayStyleProvider>
      <AnalyticsWrapper />
      <div className="min-h-screen">
        {children}
      </div>
    </DisplayStyleProvider>
  )
}
