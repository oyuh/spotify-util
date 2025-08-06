'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
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

  const applyStyle = useCallback((style: DisplayStyle) => {
    console.log('🎨 DisplayStyleContext: applyStyle called with:', style)
    if (typeof document !== 'undefined') {
      // Find the stream container to apply styles only there
      const streamContainer = document.querySelector('[data-stream-container="true"]') as HTMLElement

      if (!streamContainer) {
        console.warn('🚨 Stream container not found - styles will not be applied')
        return
      }

      console.log('🎯 Found stream container, applying styles locally only')

      // Apply custom CSS if provided (scoped to stream pages only)
      if (style.customCSS) {
        console.log('🎨 Applying custom CSS for stream page')
        let customStyleElement = document.getElementById('stream-custom-css')
        if (!customStyleElement) {
          customStyleElement = document.createElement('style')
          customStyleElement.id = 'stream-custom-css'
          document.head.appendChild(customStyleElement)
        }
        customStyleElement.textContent = style.customCSS
      }

      // Store style data on stream container only
      streamContainer.setAttribute('data-stream-style', style.id)
      streamContainer.setAttribute('data-stream-category', style.category)

      console.log('🎨 DisplayStyleContext: applyStyle completed (stream container only)')
    }
  }, [])

  const setStyle = useCallback((styleId: string) => {
    console.log('🎨 DisplayStyleContext: Setting style to:', styleId)
    const newStyle = getDisplayStyle(styleId)
    console.log('🎨 DisplayStyleContext: Found style:', newStyle)

    setStyleState(newStyle)
    applyStyle(newStyle)
  }, [applyStyle])

  useEffect(() => {
    console.log('🎨 DisplayStyleContext: Component mounted, applying initial style')
    applyStyle(style)
  }, [])

  return (
    <DisplayStyleContext.Provider value={{
      style,
      setStyle,
      applyStyle
    }}>
      {children}
    </DisplayStyleContext.Provider>
  )
}

export function useDisplayStyle() {
  const context = useContext(DisplayStyleContext)
  if (!context) {
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
