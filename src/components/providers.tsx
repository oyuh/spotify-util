'use client'

import { SessionProvider } from "next-auth/react"
import { SpotifyProvider } from "@/contexts/spotify-context"
import { AppThemeProvider } from "@/contexts/app-theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppThemeProvider>
        <SpotifyProvider>
          {children}
        </SpotifyProvider>
      </AppThemeProvider>
    </SessionProvider>
  )
}
