'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Code, Palette, Eye, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CustomCSSDocsPage() {
  const router = useRouter()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const examples = [
    {
      title: "Make Track Title Larger",
      description: "Increase the size of the track title",
      css: `.track-title {
  font-size: 2rem !important;
  font-weight: bold !important;
}`
    },
    {
      title: "Change Card Background",
      description: "Make the card background darker and more transparent",
      css: `.stream-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}`
    },
    {
      title: "Customize Text Colors",
      description: "Change text colors for better contrast",
      css: `.track-title {
  color: #ffffff !important;
}

.track-artist {
  color: #cccccc !important;
}

.track-album {
  color: #999999 !important;
}`
    },
    {
      title: "Hide Elements",
      description: "Hide specific elements you don't want to show",
      css: `.track-duration {
  display: none !important;
}

.track-progress {
  display: none !important;
}`
    },
    {
      title: "Custom Layout",
      description: "Change the overall layout and spacing",
      css: `.stream-container {
  padding: 2rem !important;
  max-width: 600px !important;
  margin: 0 auto !important;
}

.track-info {
  text-align: center !important;
  margin-bottom: 1rem !important;
}`
    },
    {
      title: "Add Shadows and Effects",
      description: "Add visual effects like shadows and blur",
      css: `.stream-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(10px) !important;
}

.track-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
}`
    }
  ]

  const commonSelectors = [
    { selector: '.stream-container', description: 'Main container for the entire stream overlay' },
    { selector: '.stream-card', description: 'Card that contains the track information' },
    { selector: '.track-title', description: 'Song/track title' },
    { selector: '.track-artist', description: 'Artist name' },
    { selector: '.track-album', description: 'Album name' },
    { selector: '.track-duration', description: 'Track duration (e.g., "3:45")' },
    { selector: '.track-progress', description: 'Progress bar container' },
    { selector: '.track-credits', description: 'Track credits (writers, producers, etc.)' },
    { selector: '.album-art', description: 'Album cover image' },
    { selector: '.recent-tracks', description: 'Container for recent tracks list' },
    { selector: '.recent-track-item', description: 'Individual recent track item' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Custom CSS Documentation</h1>
              <p className="text-muted-foreground">Customize your stream page with CSS</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Advanced</Badge>
            <Badge variant="outline">CSS Knowledge Required</Badge>
            <Badge variant="outline">Stream Customization</Badge>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              What is Custom CSS?
            </CardTitle>
            <CardDescription>
              Custom CSS allows you to override the default styling of your stream page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Custom CSS (Cascading Style Sheets) lets you modify the appearance of your stream page beyond the built-in themes.
              You can change colors, fonts, sizes, layouts, and add visual effects to make your stream overlay unique.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">⚠️ Important Notes</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• This feature requires basic CSS knowledge</li>
                <li>• Always use <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">!important</code> to override theme styles</li>
                <li>• Test your changes before saving to avoid breaking your display</li>
                <li>• Invalid CSS may cause your stream page to not load properly</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CSS Selectors Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              CSS Selectors Reference
            </CardTitle>
            <CardDescription>
              Common CSS selectors you can use to target elements on your stream page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonSelectors.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                      {item.selector}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.selector, 'Selector')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              CSS Examples
            </CardTitle>
            <CardDescription>
              Copy and modify these examples to customize your stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{example.title}</h4>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(example.css, 'CSS Code')}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm bg-background border rounded p-3 overflow-x-auto">
                      <code>{example.css}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips and Best Practices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>💡 Tips & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Always Use !important</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Since your CSS needs to override theme styles, always add <code className="bg-muted px-1 rounded">!important</code> to your declarations:
                </p>
                <pre className="text-sm bg-background border rounded p-3">
                  <code>{`.track-title {
  font-size: 2rem !important;
  color: #ffffff !important;
}`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Test Before Saving</h4>
                <p className="text-sm text-muted-foreground">
                  Use your browser's developer tools (F12) to test CSS changes before adding them to your settings.
                  This helps you avoid breaking your stream page.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Start Simple</h4>
                <p className="text-sm text-muted-foreground">
                  Begin with simple changes like colors and font sizes before attempting complex layouts or animations.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. Use Responsive Units</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use relative units like <code className="bg-muted px-1 rounded">rem</code>, <code className="bg-muted px-1 rounded">em</code>,
                  or <code className="bg-muted px-1 rounded">%</code> instead of fixed pixel values for better responsiveness:
                </p>
                <pre className="text-sm bg-background border rounded p-3">
                  <code>{`/* Good - responsive */
.track-title { font-size: 2rem !important; }

/* Avoid - fixed size */
.track-title { font-size: 32px !important; }`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you're new to CSS or need help with specific customizations:
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Learn CSS</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Start with basic CSS tutorials
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/CSS', '_blank')}
                  >
                    MDN CSS Docs
                  </Button>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Browser DevTools</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Inspect elements and test CSS live
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://developer.chrome.com/docs/devtools/', '_blank')}
                  >
                    DevTools Guide
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
