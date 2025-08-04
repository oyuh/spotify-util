'use client'

import { DisplayStyleProvider } from '@/contexts/display-style-context'
import { useEffect } from 'react'

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Reset app theme CSS variables to prevent interference with display styles
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Store original values
      const originalValues: { [key: string]: string } = {}
      const appThemeProperties = [
        '--background', '--foreground', '--card', '--card-foreground',
        '--popover', '--popover-foreground', '--primary', '--primary-foreground',
        '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
        '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
        '--border', '--input', '--ring', '--sidebar', '--sidebar-foreground',
        '--sidebar-primary'
      ]

      // Store current values and clear them for display pages
      appThemeProperties.forEach(prop => {
        originalValues[prop] = root.style.getPropertyValue(prop)
        root.style.removeProperty(prop)
      })

      // Cleanup function to restore original values when leaving display pages
      return () => {
        appThemeProperties.forEach(prop => {
          if (originalValues[prop]) {
            root.style.setProperty(prop, originalValues[prop])
          }
        })
      }
    }
  }, [])

  return (
    <DisplayStyleProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </DisplayStyleProvider>
  )
}
