"use client"

import { createContext, useContext, ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

interface SpotifyContextType {
  // Add any additional context data here
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)

export function SpotifyProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SpotifyContext.Provider value={{}}>
        {children}
      </SpotifyContext.Provider>
    </SessionProvider>
  )
}

export function useSpotifyContext() {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error("useSpotifyContext must be used within a SpotifyProvider")
  }
  return context
}
