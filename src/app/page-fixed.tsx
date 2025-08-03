"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Shield, Eye, Palette, MonitorSpeaker, Link2 } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const features = [
    {
      icon: Music,
      title: "Live Track Display",
      description: "Show your currently playing track and recent listening history with real-time updates."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Create hidden links with custom slugs that aren't tied to your Spotify ID for complete privacy."
    },
    {
      icon: Eye,
      title: "Public Sharing",
      description: "Share your music taste with customizable public displays that you control completely."
    },
    {
      icon: Palette,
      title: "Custom Styling",
      description: "Use custom CSS to style your displays however you want - make it uniquely yours."
    },
    {
      icon: MonitorSpeaker,
      title: "Streamer Mode",
      description: "Perfect for streamers with transparent backgrounds and fixed positioning options."
    },
    {
      icon: Link2,
      title: "Easy Integration",
      description: "Simple API endpoints that work with OBS, websites, or any application that can fetch JSON."
    }
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SpotifyUtil</span>
          </div>
          <Button onClick={() => signIn("spotify")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Login with Spotify
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 border-primary/30">
            🎵 Now Playing: Your Music, Your Way
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-emerald-400 bg-clip-text text-transparent">
            Share Your Spotify
            <br />
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Like Never Before</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create beautiful, customizable displays of your Spotify activity. Perfect for streamers,
            music lovers, and anyone who wants to share their musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => signIn("spotify")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:border-primary">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Share Your Music
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From privacy controls to custom styling, we've got all the features you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-border hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            See It In Action
          </h2>
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-2">
            <div className="bg-black/90 rounded-lg p-6 text-white font-mono text-sm border border-primary/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-400">https://your-site.com/display/abc123</span>
              </div>
              <div className="space-y-2">
                <div className="text-primary">🎵 Now Playing:</div>
                <div className="text-white text-lg">Song Title - Artist Name</div>
                <div className="text-gray-400">Album: Album Name (2024)</div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div className="w-20 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-gray-400">2:30 / 4:15</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-6">
              Your music displays can be styled however you want with custom CSS!
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground p-12 text-center border-primary">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Share Your Music?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of music lovers already using SpotifyUtil
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => signIn("spotify")}
            className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90"
          >
            Start Your Musical Journey
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-5 w-5" />
            <span className="font-semibold">SpotifyUtil</span>
          </div>
          <p>Made with ❤️ for music lovers everywhere</p>
        </div>
      </footer>
    </div>
  )
}
