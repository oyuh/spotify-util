'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DisplayStyle, getDisplayStyle } from '@/lib/app-themes'

interface DisplayStyleContextType {
  style: DisplayStyle
  setStyle: (styleId: string, backgroundImage?: string) => void
  applyStyle: (style: DisplayStyle) => void
  setStyleWithPreferences: (styleId: string, preferences: any) => void
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
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>()

  const applyStyle = useCallback((style: DisplayStyle) => {
    console.log('🎨 DisplayStyleContext: applyStyle called with:', style)
    if (typeof document !== 'undefined') {
      // Find the display container to apply styles only there
      const displayContainer = document.querySelector('[data-display-container="true"]') as HTMLElement

      if (!displayContainer) {
        console.warn('🚨 Display container not found - styles will not be applied')
        return
      }

      console.log('🎯 Found display container, applying styles locally only')

      // Apply custom CSS if provided (still global since it's in head)
      if (style.customCSS) {
        console.log('🎨 Applying custom CSS')
        let customStyleElement = document.getElementById('display-custom-css')
        if (!customStyleElement) {
          customStyleElement = document.createElement('style')
          customStyleElement.id = 'display-custom-css'
          document.head.appendChild(customStyleElement)
        }
        customStyleElement.textContent = style.customCSS
      }

      // Store style data on display container only
      displayContainer.setAttribute('data-display-style', style.id)
      displayContainer.setAttribute('data-display-category', style.category)

      // Apply background image (from style or global state)
      const bgImage = style.backgroundImage || backgroundImage

      if (bgImage) {
        displayContainer.setAttribute('data-has-bg-image', 'true')
        displayContainer.style.backgroundImage = `url("${bgImage}")`
        displayContainer.style.backgroundSize = 'cover'
        displayContainer.style.backgroundPosition = 'center'
        displayContainer.style.backgroundRepeat = 'no-repeat'
        displayContainer.style.backgroundAttachment = 'fixed'
        console.log('🖼️ Applied background image to display container:', bgImage)
      } else {
        console.log('🖼️ No background image, removing background properties')
        displayContainer.removeAttribute('data-has-bg-image')
        displayContainer.style.backgroundImage = ''
        displayContainer.style.backgroundSize = ''
        displayContainer.style.backgroundPosition = ''
        displayContainer.style.backgroundRepeat = ''
        displayContainer.style.backgroundAttachment = ''
      }

      console.log('🎨 DisplayStyleContext: applyStyle completed (display container only)')
    }
  }, [backgroundImage])

  const setStyle = useCallback((styleId: string, backgroundImage?: string) => {
    console.log('🎨 DisplayStyleContext: Setting style to:', styleId, 'with background:', backgroundImage)
    const baseStyle = getDisplayStyle(styleId)
    console.log('🎨 DisplayStyleContext: Found style:', baseStyle)

    // Create a proper copy of the style to avoid mutation
    const newStyle = {
      ...baseStyle,
      backgroundImage: baseStyle.backgroundImage // Keep any existing background from the style
    }

    // If a background image was explicitly provided, use it
    if (backgroundImage !== undefined) {
      newStyle.backgroundImage = backgroundImage
      setBackgroundImage(backgroundImage)
      console.log('🖼️ DisplayStyleContext: Using provided background image:', backgroundImage)
    }

    setStyleState(newStyle)
    applyStyle(newStyle)
  }, [applyStyle])

  const setStyleWithPreferences = useCallback((styleId: string, preferences: any) => {
    console.log('🎨 DisplayStyleContext: setStyleWithPreferences called with:', { styleId, preferences })

    const bgImage = preferences?.displaySettings?.backgroundImage
    console.log('🖼️ DisplayStyleContext: Background image from preferences:', bgImage)

    setStyle(styleId, bgImage)
  }, [setStyle])

  useEffect(() => {
    console.log('🎨 DisplayStyleContext: Component mounted, applying initial style')
    applyStyle(style)
  }, [])

  return (
    <DisplayStyleContext.Provider value={{
      style,
      setStyle,
      applyStyle,
      setStyleWithPreferences
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
