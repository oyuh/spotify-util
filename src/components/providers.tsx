'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SpotifyProvider } from "@/contexts/spotify-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        <SpotifyProvider>
          {children}
        </SpotifyProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
