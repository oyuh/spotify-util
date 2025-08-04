"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Music, Shield, Eye, Palette, MonitorSpeaker, Link2,
  Sparkles, Zap, Star, Image, Brush, Users,
  Radio, Headphones, PaintBucket, Wand2, Crown, Globe
} from "lucide-react"
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

  const mainFeatures = [
    {
      icon: Music,
      title: "Real-Time Music Display",
      description: "Show your currently playing track with live progress, album art, and artist information.",
      badge: "Live",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Palette,
      title: "14 Beautiful Themes",
      description: "Choose from minimal, cyberpunk, retro-wave, galaxy, aurora, and many more stunning themes.",
      badge: "New",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Image,
      title: "Custom Backgrounds",
      description: "Upload your own background images to create completely personalized displays.",
      badge: "Featured",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description: "Hide your Spotify ID and use custom slugs for complete privacy and security.",
      badge: "Secure",
      color: "from-orange-500 to-red-600"
    }
  ]

  const allFeatures = [
    {
      icon: Sparkles,
      title: "Animated Themes",
      description: "Retro scan lines, aurora waves, matrix rain, and starfield animations"
    },
    {
      icon: MonitorSpeaker,
      title: "Streamer Ready",
      description: "Transparent backgrounds, fixed positioning, and OBS integration"
    },
    {
      icon: Globe,
      title: "Public Sharing",
      description: "Share your music taste with beautiful public displays"
    },
    {
      icon: Brush,
      title: "Custom CSS",
      description: "Full customization with your own CSS styling"
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Real-time synchronization with your Spotify activity"
    },
    {
      icon: Users,
      title: "Multiple Modes",
      description: "Different display modes for various use cases"
    }
  ]

  const themes = [
    { name: "Minimal", preview: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", category: "Clean" },
    { name: "Spotify Classic", preview: "linear-gradient(135deg, #1DB954 0%, #121212 100%)", category: "Official" },
    { name: "Neon Purple", preview: "linear-gradient(135deg, #8B5CF6 0%, #1F1B24 100%)", category: "Cyberpunk" },
    { name: "Retro Wave", preview: "linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%)", category: "80s" },
    { name: "Ocean Breeze", preview: "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)", category: "Nature" },
    { name: "Galaxy Purple", preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", category: "Space" },
    { name: "Gold Luxury", preview: "linear-gradient(135deg, #FFD700 0%, #000000 100%)", category: "Premium" },
    { name: "Aurora Borealis", preview: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #FF0080 100%)", category: "Natural" }
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
          <Music className="absolute inset-0 m-auto h-8 w-8 text-green-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,120,200,0.1),transparent_50%)]"></div>

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-20 text-center">
          <div className="max-w-6xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-medium px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              14 New Themes • Custom Backgrounds • GSAP Animations
            </Badge>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Your Music,
              </span>
              <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Visualized
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Beautifully
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create stunning, customizable displays of your Spotify activity with
              <span className="text-green-400 font-semibold"> 14 beautiful themes</span>,
              <span className="text-purple-400 font-semibold"> custom backgrounds</span>, and
              <span className="text-cyan-400 font-semibold"> smooth animations</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => signIn("spotify")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg px-12 py-6 rounded-xl shadow-2xl shadow-green-500/25 transform transition-all hover:scale-105"
              >
                <Music className="w-5 h-5 mr-2" />
                Start Creating Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 rounded-xl border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black transition-all transform hover:scale-105"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">14+</div>
                <div className="text-gray-400">Stunning Themes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">∞</div>
                <div className="text-gray-400">Custom Backgrounds</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">100%</div>
                <div className="text-gray-400">Free Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to make your music displays absolutely stunning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Theme Showcase */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                14 Stunning Themes
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From minimal to cyberpunk, find the perfect style for your music
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {themes.map((theme, index) => (
              <div key={index} className="group cursor-pointer">
                <div
                  className="aspect-square rounded-xl shadow-lg transition-all group-hover:scale-105 group-hover:shadow-2xl mb-3"
                  style={{ background: theme.preview }}
                ></div>
                <div className="text-center">
                  <h3 className="text-white font-medium group-hover:text-green-400 transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{theme.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:from-gray-700 hover:to-gray-800 transition-all">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                See It In Action
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the magic of real-time music visualization
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              <div className="bg-gray-800 p-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-center text-gray-400 text-sm">
                  your-music.display/stream/your-slug
                </div>
              </div>
              <div className="p-8 sm:p-12">
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-8 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mx-auto mb-6 shadow-lg"></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Now Playing</h3>
                  <p className="text-green-400 text-lg mb-1">Blinding Lights</p>
                  <p className="text-gray-400">The Weeknd</p>
                  <div className="mt-6 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full w-1/3 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Your Music Experience?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who are already creating beautiful music displays
            </p>

            <Button
              size="lg"
              onClick={() => signIn("spotify")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-xl px-16 py-8 rounded-xl shadow-2xl shadow-green-500/25 transform transition-all hover:scale-105"
            >
              <Music className="w-6 h-6 mr-3" />
              Get Started Free
            </Button>

            <p className="text-gray-500 mt-6">
              No credit card required • Connect with Spotify in seconds
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Music className="w-8 h-8 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">SpotifyUtil</span>
            </div>
            <p className="text-gray-400 mb-4">
              Beautiful music displays for everyone
            </p>
            <div className="flex justify-center space-x-6 text-gray-500">
              <span>Privacy</span>
              <span>•</span>
              <span>Terms</span>
              <span>•</span>
              <span>Support</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
