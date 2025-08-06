'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Code, Palette, Settings, Users, FileText, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ThemeTester } from '@/components/ThemeTester'

export default function DocsHomePage() {
  const router = useRouter()
  const [themeTesterOpen, setThemeTesterOpen] = useState(false)

  const docSections = [
    {
      title: "Custom CSS",
      description: "Learn how to customize your stream page with CSS",
      icon: <Code className="w-5 h-5" />,
      badge: "Popular",
      badgeVariant: "default" as const,
      href: "/docs/custom-css",
      features: ["CSS Selectors", "Examples", "Best Practices"]
    },
    {
      title: "Display Themes",
      description: "Explore built-in themes and styling options",
      icon: <Palette className="w-5 h-5" />,
      badge: "Interactive",
      badgeVariant: "default" as const,
      href: "/docs/themes",
      features: ["Theme Gallery", "Live Preview", "Customization"],
      action: () => setThemeTesterOpen(true)
    },
  ]

  const quickActions = [
    {
      title: "Quick Start",
      description: "Get your display up and running in 5 minutes",
      action: () => router.push('/dashboard'),
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      title: "Custom CSS Guide",
      description: "Learn to style your stream page",
      action: () => router.push('/docs/custom-css'),
      icon: <Code className="w-4 h-4" />
    },
    {
      title: "Browse Themes",
      description: "Preview all themes in our interactive tester",
      action: () => setThemeTesterOpen(true),
      icon: <Palette className="w-4 h-4" />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Documentation</h1>
              <p className="text-muted-foreground text-lg">Everything you need to customize your Spotify stream</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">Beginner Friendly</Badge>
            <Badge variant="outline">Comprehensive Guides</Badge>
            <Badge variant="outline">Code Examples</Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how to customize your Spotify stream, integrate with external services, and make the most of our platform's features.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Jump right into the most common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={action.action}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {action.icon}
                    <h4 className="font-medium">{action.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentation Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {docSections.map((section, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant={section.badgeVariant}>{section.badge}</Badge>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {section.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      if (section.action) {
                        section.action()
                      } else {
                        router.push(section.href)
                      }
                    }}
                  >
                    Read Guide
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help with technical issues
                </p>
                <Button variant="outline" size="sm" onClick={() => router.push('/support')}>
                  Contact Support
                </Button>
              </div>

              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">Community</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Join our Discord community
                </p>
                <Button variant="outline" size="sm">
                    {/* variant="outline" size="sm" onClick={() => window.open('https://discord.gg/spotifyutil', '_blank') */}
                  COMING SOON
                </Button>
              </div>

              <div className="text-center">
                <Code className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">GitHub</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Report bugs and contribute
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://github.com/oyuh/spotify-util', '_blank')}>
                  View Source
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Tester Modal */}
      <ThemeTester
        open={themeTesterOpen}
        onOpenChange={setThemeTesterOpen}
      />
    </div>
  )
}
