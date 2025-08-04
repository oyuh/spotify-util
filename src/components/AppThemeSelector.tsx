'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette } from 'lucide-react'
import { useAppTheme } from '@/contexts/app-theme-context'
import { appThemes } from '@/lib/app-themes'
import { toast } from 'sonner'

interface AppThemeSelectorProps {
  children: React.ReactNode
}

export default function AppThemeSelector({ children }: AppThemeSelectorProps) {
  const { theme, setTheme } = useAppTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeSelect = async (themeId: string) => {
    const selectedTheme = appThemes.find(t => t.id === themeId)
    setTheme(themeId)

    // Save to server
    try {
      const response = await fetch('/api/user/app-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      })

      if (response.ok) {
        toast.success(`App theme changed to ${selectedTheme?.name || themeId}`)
      } else {
        toast.error('Failed to save app theme')
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      toast.error('Failed to save app theme')
    }

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>App Theme Settings</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose how the dashboard, navigation, and settings interface looks to you.
            This is private and only affects your view of the app.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Interface Themes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appThemes.map((appTheme) => {
                const isActive = theme.id === appTheme.id

                return (
                  <Card
                    key={appTheme.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isActive ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleThemeSelect(appTheme.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Theme Preview */}
                        <div
                          className="w-full h-20 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                          style={{ background: appTheme.preview }}
                        >
                          {appTheme.name}
                        </div>

                        {/* Theme Info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{appTheme.name}</h4>
                            {isActive && <Badge variant="default">Active</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {appTheme.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
