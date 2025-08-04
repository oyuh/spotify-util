'use client'

import { DisplayStyleProvider, useDisplayStyleClasses, useDisplayStyle } from '@/contexts/display-style-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { displayStyles } from '@/lib/app-themes'

function TestStylesContent() {
  const styleClasses = useDisplayStyleClasses()
  const { style, setStyle } = useDisplayStyle()

  const handleStyleChange = (styleId: string) => {
    console.log('🎨 Test Page: Changing style to:', styleId)
    setStyle(styleId)
  }

  return (
    <div className={`min-h-screen p-8 ${styleClasses.background}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className={`text-3xl font-bold ${styleClasses.text}`}>
          Display Styles Test Page
        </h1>

        <div className="bg-red-500 p-4 text-white mb-4">
          DEBUG: This should be a red background to test if Tailwind is working
        </div>

        <div className="bg-green-500 p-4 text-white mb-4">
          Current style ID: {style.id} | Current style name: {style.name}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {displayStyles.map((displayStyle) => (
            <Button
              key={displayStyle.id}
              onClick={() => handleStyleChange(displayStyle.id)}
              variant={displayStyle.id === style.id ? "default" : "outline"}
              className="h-auto p-3 flex flex-col items-center"
            >
              <div
                className="w-8 h-8 rounded mb-2"
                style={{ background: displayStyle.preview }}
              />
              <span className="text-xs">{displayStyle.name}</span>
            </Button>
          ))}
        </div>

        <Card className={`${styleClasses.cardBackground} ${styleClasses.cardBorder} ${styleClasses.shadow}`}>
          <CardContent className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${styleClasses.text}`}>
              Sample Music Track
            </h2>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className={`text-xs ${styleClasses.secondaryText}`}>Album</span>
              </div>

              <div className="flex-1">
                <h3 className={`font-semibold ${styleClasses.text}`}>Track Name</h3>
                <p className={`${styleClasses.secondaryText}`}>Artist Name</p>
                <p className={`text-sm ${styleClasses.accent}`}>Album Name</p>
              </div>
            </div>

            <div className="mt-4">
              <div className={`w-full h-2 rounded-full ${styleClasses.progressBackground}`}>
                <div className={`w-3/5 h-full rounded-full ${styleClasses.progressBar}`}></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${styleClasses.secondaryText}`}>1:23</span>
                <span className={`text-xs ${styleClasses.secondaryText}`}>3:45</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className={`text-lg font-semibold ${styleClasses.text}`}>Current Style Classes:</h3>
          <pre className={`text-xs ${styleClasses.secondaryText} bg-black/10 p-4 rounded overflow-auto`}>
            {JSON.stringify(styleClasses, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default function TestStylesPage() {
  return (
    <DisplayStyleProvider>
      <TestStylesContent />
    </DisplayStyleProvider>
  )
}
