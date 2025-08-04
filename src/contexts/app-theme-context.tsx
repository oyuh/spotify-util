'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AppTheme, getAppTheme } from '@/lib/app-themes'

interface AppThemeContextType {
  theme: AppTheme
  setTheme: (themeId: string) => void
  applyTheme: (theme: AppTheme) => void
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined)

interface AppThemeProviderProps {
  children: React.ReactNode
  initialTheme?: string
}

export function AppThemeProvider({
  children,
  initialTheme = 'dark'
}: AppThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(getAppTheme(initialTheme))

  const applyTheme = (theme: AppTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Apply CSS custom properties
      Object.entries(theme.variables).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
    }
  }

  const setTheme = (themeId: string) => {
    const newTheme = getAppTheme(themeId)
    setThemeState(newTheme)
    applyTheme(newTheme)

    // Store theme preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotify-util-app-theme', themeId)
    }
  }

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spotify-util-app-theme')
      if (stored) {
        const storedTheme = getAppTheme(stored)
        setThemeState(storedTheme)
        applyTheme(storedTheme)
      } else {
        // Apply initial theme
        applyTheme(theme)
      }
    }
  }, [])

  return (
    <AppThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </AppThemeContext.Provider>
  )
}

export function useAppTheme() {
  const context = useContext(AppThemeContext)
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider')
  }
  return context
}
