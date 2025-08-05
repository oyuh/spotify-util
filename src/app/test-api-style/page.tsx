'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Music } from 'lucide-react'
import { useDisplayStyle, useDisplayStyleClasses } from '@/contexts/display-style-context'
import { getDisplayStyle } from '@/lib/app-themes'

export default function TestApiStyle() {
  const { applyStyle } = useDisplayStyle()
  const styleClasses = useDisplayStyleClasses()
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    const testApiStyle = async () => {
      try {
        console.log('🔍 Test API Style: Fetching user preferences from API')

        // Use the same API call as the display page
        const response = await fetch('/api/display/lawsonhart')
        const data = await response.json()

        console.log('🔍 Test API Style: API response:', data)
        setApiData(data)

        if (data.preferences?.displaySettings?.style) {
          const styleId = data.preferences.displaySettings.style
          const backgroundImage = data.preferences.displaySettings.backgroundImage

          console.log('🔍 Test API Style: Found style:', styleId)
          console.log('🔍 Test API Style: Found background:', backgroundImage)

          // Apply the exact same logic as the display page
          const baseStyle = getDisplayStyle(styleId)
          console.log('🔍 Test API Style: Base style:', baseStyle)

          if (backgroundImage) {
            const customStyle = {
              ...baseStyle,
              backgroundImage: backgroundImage
            }
            console.log('🔍 Test API Style: Applying custom style with background:', customStyle)
            applyStyle(customStyle)
          } else {
            console.log('🔍 Test API Style: No background, applying base style')
            applyStyle(baseStyle)
          }
        }
      } catch (error) {
        console.error('🔍 Test API Style: Error:', error)
      }
    }

    testApiStyle()
  }, [applyStyle])

  return (
    <div className={`min-h-screen ${styleClasses.background} flex items-center justify-center p-4`}>
      <Card className={`max-w-2xl ${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h2 className={`text-xl font-semibold ${styleClasses.text}`}>API Style Test</h2>
              <p className={`${styleClasses.secondaryText} mt-2`}>
                This page tests the exact same API data and style application logic as the display page.
              </p>

              {apiData && (
                <div className="mt-4 text-sm">
                  <p className={styleClasses.accent}>
                    <strong>Style ID:</strong> {apiData.preferences?.displaySettings?.style || 'None'}
                  </p>
                  <p className={styleClasses.accent}>
                    <strong>Background Image:</strong> {apiData.preferences?.displaySettings?.backgroundImage || 'None'}
                  </p>
                  <div className="mt-2 text-xs text-left">
                    <strong>API Response (displaySettings):</strong>
                    <pre className="bg-black/50 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(apiData.preferences?.displaySettings, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
