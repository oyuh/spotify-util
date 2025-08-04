'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { DisplayStyle, getDisplayStyle } from '@/lib/app-themes'

interface DisplayStyleContextType {
  style: DisplayStyle
  setStyle: (styleId: string) => void
  applyStyle: (style: DisplayStyle) => void
}

const DisplayStyleContext = createContext<DisplayStyleContextType | undefined>(undefined)

interface DisplayStyleProviderProps {
  children: React.ReactNode
  initialStyle?: string
}

export function DisplayStyleProvider({
  children,
  initialStyle = 'minimal'
}: DisplayStyleProviderProps) {
  const [style, setStyleState] = useState<DisplayStyle>(getDisplayStyle(initialStyle))

  const applyStyle = (style: DisplayStyle) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Apply custom CSS if provided
      if (style.customCSS) {
        let customStyleElement = document.getElementById('display-custom-css')
        if (!customStyleElement) {
          customStyleElement = document.createElement('style')
          customStyleElement.id = 'display-custom-css'
          document.head.appendChild(customStyleElement)
        }
        customStyleElement.textContent = style.customCSS
      }

      // Apply background image if provided
      if (style.backgroundImage) {
        root.style.setProperty('--display-bg-image', `url(${style.backgroundImage})`)
        root.style.setProperty('--display-bg-blend', 'overlay')
      } else {
        root.style.removeProperty('--display-bg-image')
        root.style.removeProperty('--display-bg-blend')
      }

      // Store style data on root for CSS classes to use
      root.setAttribute('data-display-style', style.id)
      root.setAttribute('data-display-category', style.category)
    }
  }

  const setStyle = (styleId: string) => {
    console.log('🎨 DisplayStyleContext: Setting style to:', styleId)
    const newStyle = getDisplayStyle(styleId)
    console.log('🎨 DisplayStyleContext: Found style:', newStyle)
    setStyleState(newStyle)
    applyStyle(newStyle)
  }

  // Apply initial style on mount
  useEffect(() => {
    applyStyle(style)
  }, [])

  return (
    <DisplayStyleContext.Provider value={{ style, setStyle, applyStyle }}>
      {children}
    </DisplayStyleContext.Provider>
  )
}

export function useDisplayStyle() {
  const context = useContext(DisplayStyleContext)
  if (context === undefined) {
    throw new Error('useDisplayStyle must be used within a DisplayStyleProvider')
  }
  return context
}

// Helper hook to get style classes
export function useDisplayStyleClasses() {
  const { style } = useDisplayStyle()
  console.log('🎨 useDisplayStyleClasses: Current style:', style)
  const classes = {
    background: style.styles.background,
    cardBackground: style.styles.cardBackground,
    cardBorder: style.styles.cardBorder,
    text: style.styles.text,
    secondaryText: style.styles.secondaryText,
    accent: style.styles.accent,
    progressBar: style.styles.progressBar,
    progressBackground: style.styles.progressBackground,
    shadow: style.styles.shadow,
    hover: style.styles.hover,
    fontFamily: style.styles.fontFamily || 'font-sans',
    fontSize: style.styles.fontSize || 'text-base',
    borderRadius: style.styles.borderRadius || 'rounded-md'
  }
  console.log('🎨 useDisplayStyleClasses: Returning classes:', classes)
  return classes
}
