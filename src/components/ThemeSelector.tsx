'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Monitor, Video } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { displayThemes, streamThemes, ThemeConfig } from '@/lib/themes'

interface ThemeSelectorProps {
  children: React.ReactNode
}

export default function ThemeSelector({ children }: ThemeSelectorProps) {
  const { theme, setTheme, themeType } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [previewType, setPreviewType] = useState<'display' | 'stream'>(themeType)

  const handleThemeSelect = (themeId: string, type: 'display' | 'stream') => {
    setTheme(themeId, type)
    setIsOpen(false)
    setPreviewTheme(null)
  }

  const handlePreview = (themeId: string, type: 'display' | 'stream') => {
    setPreviewTheme(themeId)
    setPreviewType(type)
  }

  const renderThemeGrid = (themes: ThemeConfig[], type: 'display' | 'stream') => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((themeConfig) => {
        const isActive = theme.id === themeConfig.id && themeType === type
        const isPreviewing = previewTheme === themeConfig.id && previewType === type

        return (
          <Card
            key={themeConfig.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              isActive ? 'ring-2 ring-primary' : ''
            } ${isPreviewing ? 'ring-2 ring-accent' : ''}`}
            onClick={() => handleThemeSelect(themeConfig.id, type)}
            onMouseEnter={() => handlePreview(themeConfig.id, type)}
            onMouseLeave={() => setPreviewTheme(null)}
          >
            <CardContent className="p-4">
              {/* Theme Preview */}
              <div
                className="w-full h-24 rounded-lg mb-3 border"
                style={{ background: themeConfig.preview }}
              ></div>

              {/* Theme Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{themeConfig.name}</h3>
                  {isActive && <Badge variant="default">Active</Badge>}
                  {isPreviewing && !isActive && <Badge variant="secondary">Preview</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {themeConfig.description}
                </p>

                {/* Theme Color Palette */}
                <div className="flex space-x-1 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: themeConfig.styles.accent.includes('text-') ?
                      getColorFromTailwind(themeConfig.styles.accent) : '#8B5CF6'
                    }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: themeConfig.styles.progressBar.includes('bg-') ?
                      getColorFromTailwind(themeConfig.styles.progressBar) : '#10B981'
                    }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: themeConfig.styles.text.includes('text-') ?
                      getColorFromTailwind(themeConfig.styles.text) : '#FFFFFF'
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Choose Theme</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={themeType} onValueChange={(value) => setPreviewType(value as 'display' | 'stream')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="display" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Display Themes</span>
            </TabsTrigger>
            <TabsTrigger value="stream" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Stream Themes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="display" className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Display Themes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Themes optimized for public display pages with rich visual elements
                </p>
              </div>
              {renderThemeGrid(displayThemes, 'display')}
            </div>
          </TabsContent>

          <TabsContent value="stream" className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Stream Themes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Minimal themes perfect for streaming overlays and OBS integration
                </p>
              </div>
              {renderThemeGrid(streamThemes, 'stream')}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Current: <span className="font-medium">{theme.name}</span> ({themeType})
          </div>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to convert Tailwind classes to hex colors (simplified)
function getColorFromTailwind(className: string): string {
  const colorMap: Record<string, string> = {
    'text-green-400': '#4ADE80',
    'text-purple-400': '#C084FC',
    'text-blue-400': '#60A5FA',
    'text-cyan-400': '#22D3EE',
    'text-orange-400': '#FB923C',
    'text-red-400': '#F87171',
    'text-pink-400': '#F472B6',
    'text-yellow-400': '#FACC15',
    'text-white': '#FFFFFF',
    'text-foreground': '#FFFFFF',
    'bg-green-500': '#10B981',
    'bg-primary': '#8B5CF6',
    'bg-blue-500': '#3B82F6',
    'bg-cyan-500': '#06B6D4',
    'bg-orange-500': '#F97316',
    'bg-red-500': '#EF4444',
    'bg-purple-500': '#8B5CF6',
    // Add more as needed
  }

  // Handle gradient classes by returning the first color
  if (className.includes('gradient')) {
    if (className.includes('green')) return '#10B981'
    if (className.includes('purple')) return '#8B5CF6'
    if (className.includes('blue')) return '#3B82F6'
    if (className.includes('cyan')) return '#06B6D4'
    if (className.includes('orange')) return '#F97316'
    if (className.includes('red')) return '#EF4444'
    if (className.includes('pink')) return '#F472B6'
    return '#8B5CF6'
  }

  return colorMap[className] || '#8B5CF6'
}
