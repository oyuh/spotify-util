'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Monitor, Code, Save } from 'lucide-react'
import { useDisplayStyle } from '@/contexts/display-style-context'
import { displayStyles } from '@/lib/app-themes'

interface DisplayStyleSelectorProps {
  children: React.ReactNode
}

export default function DisplayStyleSelector({ children }: DisplayStyleSelectorProps) {
  const { style, setStyle } = useDisplayStyle()
  const [isOpen, setIsOpen] = useState(false)
  const [customCSS, setCustomCSS] = useState('')
  const [activeTab, setActiveTab] = useState('styles')

  const handleStyleSelect = (styleId: string) => {
    setStyle(styleId)
  }

  const handleSaveCustomCSS = () => {
    // TODO: Save custom CSS to user preferences
    console.log('Saving custom CSS:', customCSS)
  }

  const groupedStyles = displayStyles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = []
    }
    acc[style.category].push(style)
    return acc
  }, {} as Record<string, typeof displayStyles>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Display Style Settings</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Customize how your music display looks to visitors. These styles are public
            and will be seen by anyone who visits your display page.
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="styles">Pre-made Styles</TabsTrigger>
            <TabsTrigger value="custom">Custom CSS</TabsTrigger>
          </TabsList>

          <TabsContent value="styles" className="space-y-6">
            {Object.entries(groupedStyles).map(([category, categoryStyles]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()} Styles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStyles.map((displayStyle) => {
                    const isActive = style.id === displayStyle.id

                    return (
                      <Card
                        key={displayStyle.id}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          isActive ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleStyleSelect(displayStyle.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Style Preview */}
                            <div
                              className="w-full h-20 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                              style={{ background: displayStyle.preview }}
                            >
                              {displayStyle.name}
                            </div>

                            {/* Style Info */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{displayStyle.name}</h4>
                                {isActive && <Badge variant="default">Active</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {displayStyle.description}
                              </p>
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  {displayStyle.category}
                                </Badge>
                                {displayStyle.customCSS && (
                                  <Badge variant="secondary" className="text-xs">
                                    Custom CSS
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Custom CSS</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your own custom CSS to further customize the appearance of your display.
                  This CSS will be applied on top of the selected style.
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder={`/* Add your custom CSS here */
.display-container {
  background: linear-gradient(45deg, #ff0080, #7928ca);
}

.track-title {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* You can target any element in your display */`}
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />

                <Button onClick={handleSaveCustomCSS} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Custom CSS
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Tip:</strong> Custom CSS is applied after the base style, so you can override any styling.</p>
                <p><strong>Classes:</strong> Use browser dev tools to inspect elements and find class names to target.</p>
                <p><strong>Preview:</strong> Changes will be visible immediately on your display page.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
