'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeConfig, getTheme } from '@/lib/themes'

interface ThemeContextType {
  theme: ThemeConfig
  setTheme: (themeId: string, type: 'display' | 'stream') => void
  themeType: 'display' | 'stream'
  setThemeType: (type: 'display' | 'stream') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: string
  initialType?: 'display' | 'stream'
}

export function ThemeProvider({
  children,
  initialTheme = 'default',
  initialType = 'display'
}: ThemeProviderProps) {
  const [themeType, setThemeType] = useState<'display' | 'stream'>(initialType)
  const [theme, setThemeState] = useState<ThemeConfig>(getTheme(initialTheme, themeType))

  const setTheme = (themeId: string, type: 'display' | 'stream') => {
    const newTheme = getTheme(themeId, type)
    setThemeState(newTheme)
    setThemeType(type)

    // Store theme preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotify-util-theme', JSON.stringify({
        themeId,
        type
      }))
    }
  }

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spotify-util-theme')
      if (stored) {
        try {
          const { themeId, type } = JSON.parse(stored)
          setTheme(themeId, type)
        } catch (error) {
          console.error('Failed to parse stored theme:', error)
        }
      }
    }
  }, [])

  // Apply custom CSS when theme changes
  useEffect(() => {
    if (theme.customCSS && typeof document !== 'undefined') {
      // Remove existing custom theme styles
      const existingStyle = document.getElementById('custom-theme-styles')
      if (existingStyle) {
        existingStyle.remove()
      }

      // Add new custom styles
      const styleElement = document.createElement('style')
      styleElement.id = 'custom-theme-styles'
      styleElement.textContent = theme.customCSS
      document.head.appendChild(styleElement)
    }

    return () => {
      // Cleanup on unmount
      if (typeof document !== 'undefined') {
        const existingStyle = document.getElementById('custom-theme-styles')
        if (existingStyle) {
          existingStyle.remove()
        }
      }
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      themeType,
      setThemeType
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for applying theme classes
export function useThemeClasses() {
  const { theme } = useTheme()

  return {
    background: theme.styles.background,
    cardBackground: theme.styles.cardBackground,
    cardBorder: theme.styles.cardBorder,
    text: theme.styles.text,
    secondaryText: theme.styles.secondaryText,
    accent: theme.styles.accent,
    progressBar: theme.styles.progressBar,
    progressBackground: theme.styles.progressBackground,
    shadow: theme.styles.shadow,
    hover: theme.styles.hover,

    // Utility function to get combined classes
    getCardClasses: () => `${theme.styles.cardBackground} ${theme.styles.cardBorder} ${theme.styles.shadow}`,
    getTextClasses: () => theme.styles.text,
    getSecondaryTextClasses: () => theme.styles.secondaryText,
    getAccentClasses: () => theme.styles.accent,
    getProgressClasses: () => ({
      bar: theme.styles.progressBar,
      background: theme.styles.progressBackground
    }),
    getHoverClasses: () => theme.styles.hover
  }
}
