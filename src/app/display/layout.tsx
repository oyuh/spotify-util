'use client'

import { DisplayStyleProvider } from '@/contexts/display-style-context'

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DisplayStyleProvider>
      <div className="min-h-screen" data-display-container="true">
        {children}
      </div>
    </DisplayStyleProvider>
  )
}
