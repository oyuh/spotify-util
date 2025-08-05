'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Music } from 'lucide-react'
import { useDisplayStyle, useDisplayStyleClasses } from '@/contexts/display-style-context'
import { getDisplayStyle } from '@/lib/app-themes'

export default function TestForestDark() {
  const { applyStyle } = useDisplayStyle()
  const styleClasses = useDisplayStyleClasses()

  useEffect(() => {
    console.log('🌲 Test Forest Dark: Applying forest-dark theme with background image')

    // Get the forest-dark style
    const forestDarkStyle = getDisplayStyle('forest-dark')
    console.log('🌲 Test Forest Dark: Base forest-dark style:', forestDarkStyle)

    // Create a custom style with the background image
    const customStyle = {
      ...forestDarkStyle,
      backgroundImage: 'https://i.imgur.com/ifdLc1s.jpeg'
    }
    console.log('🌲 Test Forest Dark: Custom style with background:', customStyle)

    // Apply the style directly
    applyStyle(customStyle)
  }, [applyStyle])

  return (
    <div className={`min-h-screen ${styleClasses.background} flex items-center justify-center p-4`}>
      <Card className={`max-w-md ${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${styleClasses.text}`}>Forest Dark Theme Test</h2>
              <p className={`${styleClasses.secondaryText} mt-2`}>
                This page tests the forest-dark theme with the Imgur background image.
                If you can see a forest background image, the theming system is working correctly.
              </p>
              <p className={`${styleClasses.accent} mt-2 text-sm`}>
                Background Image: https://i.imgur.com/ifdLc1s.jpeg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
