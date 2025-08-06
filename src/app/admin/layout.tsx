import { Metadata } from 'next'
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper'

export const metadata: Metadata = {
  title: 'Admin Panel - Spotify Util',
  description: 'Development administration panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AnalyticsWrapper />
      {children}
    </div>
  )
}
