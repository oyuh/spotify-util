"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Music, Shield, Eye, Palette, MonitorSpeaker, Link2,
  Sparkles, Zap, Star, Image, Brush, Users, Code2,
  Radio, Headphones, PaintBucket, Wand2, Crown, Globe, Play, Pause, SkipForward,
  ExternalLink, Github, Coffee, Heart, Wrench, Terminal, Clock
} from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(33)
  const [demoTrack, setDemoTrack] = useState({
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20"
  })
  const [customCSS, setCustomCSS] = useState(`.music-overlay {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}`)

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => prev >= 100 ? 0 : prev + 0.5)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  // GSAP animations (simplified)
  useEffect(() => {
    const initAnimations = async () => {
      try {
        const { gsap } = await import("gsap")
        if (typeof window !== "undefined") {
          gsap.fromTo(".hero-content",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          )
        }
      } catch (error) {
        console.log('GSAP loading failed, using fallback')
      }
    }
    initAnimations()
  }, [])

  const themes = [
    {
      id: "minimal",
      name: "Minimal",
      bg: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
      text: "text-white",
      accent: "#1DB954"
    },
    {
      id: "neon-purple",
      name: "Neon Purple",
      bg: "linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%)",
      text: "text-white",
      accent: "#a855f7"
    },
    {
      id: "retro-wave",
      name: "Retro Wave",
      bg: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
      text: "text-white",
      accent: "#ff0080"
    },
    {
      id: "cyberpunk-red",
      name: "Cyberpunk Red",
      bg: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
      text: "text-white",
      accent: "#ef4444"
    }
  ]

  // Helper function to parse basic CSS for preview
  function parseInlineCSS(css: string) {
    const styles: any = {}
    try {
      // Basic CSS parsing for demo purposes
      const rules = css.match(/[^{}]+\{[^{}]*\}/g) || []
      rules.forEach(rule => {
        const [selector, declarations] = rule.split('{')
        if (selector.includes('.music-overlay')) {
          const decls = declarations.replace('}', '').split(';')
          decls.forEach(decl => {
            const [prop, value] = decl.split(':')
            if (prop && value) {
              const camelProp = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase())
              styles[camelProp] = value.trim()
            }
          })
        }
      })
    } catch (e) {
      // If parsing fails, return empty object
    }
    return styles
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400"></div>
          <Music className="absolute inset-0 m-auto h-6 w-6 text-green-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="hero-content max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Your Spotify, but
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              way cooler ✨
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop using boring music widgets. Make displays that actually look good—
            <br />perfect for streams, desktops, or just flexing your music taste 🎵
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Button
              size="lg"
              onClick={() => signIn("spotify")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Music className="w-6 h-6 mr-2" />
              Let's go!
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('/display/wthlaw', '_blank')}
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-8 py-4 text-lg rounded-xl"
            >
              <Eye className="w-6 h-6 mr-2" />
              Check this out
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 text-gray-400 justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-lg">65+ sick themes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span className="text-lg">Updates instantly</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span className="text-lg">Custom CSS wizardry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Display Demo */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-green-500/20 text-green-400 border border-green-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive Demo
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Try the display builder</h2>
            <p className="text-gray-400">Pick a theme and customize your track</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Theme Selector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTheme(index)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTheme === index
                            ? 'border-green-400 bg-gray-700'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded mb-2"
                          style={{ background: theme.bg }}
                        ></div>
                        <p className="text-sm font-medium">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Custom Track
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Song name"
                    value={demoTrack.name}
                    onChange={(e) => setDemoTrack({...demoTrack, name: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Input
                    placeholder="Artist"
                    value={demoTrack.artist}
                    onChange={(e) => setDemoTrack({...demoTrack, artist: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                  <div className="text-sm text-gray-400">
                    <p>💡 Demo mode - real version syncs with your Spotify automatically</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview - Fixed display that actually looks like the real thing */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-600 text-white">✨ Live Preview</Badge>
              </div>

              <div
                className="rounded-xl p-6 min-h-[500px] flex items-center justify-center relative overflow-hidden"
                style={{
                  background: themes[selectedTheme].bg
                }}
              >
                {/* Actual Display Page Recreation */}
                <div className="w-full max-w-md">
                  <Card className="bg-black/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center space-y-6">
                        {/* Album Art */}
                        <div className="relative group">
                          <div className="w-48 h-48 rounded-xl shadow-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600/50">
                            <Music className="w-16 h-16 text-gray-400" />
                          </div>
                          {isPlaying && (
                            <div className="absolute inset-0 rounded-xl border-4 border-green-400 animate-pulse"></div>
                          )}
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            {isPlaying ? <Play className="w-3 h-3 text-white fill-current" /> : <Pause className="w-3 h-3 text-white" />}
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="w-full space-y-3">
                          <h1 className="text-2xl font-bold text-white leading-tight">
                            {demoTrack.name}
                          </h1>
                          <p className="text-lg text-gray-300">{demoTrack.artist}</p>
                          <p className="text-md text-gray-400">
                            from <span className="font-semibold">{demoTrack.album}</span>
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-2 w-full pt-2">
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div
                                className="bg-green-400 h-2 rounded-full transition-all duration-1000 ease-linear shadow-lg shadow-green-400/30"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <span>{Math.floor(progress * 3.33 / 100)}:{String(Math.floor((progress * 2) % 60)).padStart(2, '0')}</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{demoTrack.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex flex-col items-center space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                              <span className="text-sm font-medium text-gray-300">
                                {isPlaying ? 'Now Playing' : 'Paused'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Updated {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Powered by */}
                      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                        <p className="text-xs text-gray-500">
                          Powered by <span className="font-semibold text-gray-400">JamLog</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => window.open('/display/wthlaw', '_blank')}
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open real display
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stream Mode Interactive Demo */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Radio className="w-4 h-4 mr-2" />
              Stream Mode
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Stream Overlays with Custom CSS</h2>
            <p className="text-gray-400">For the streamers who want their overlay to actually look good</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CSS Editor */}
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Code2 className="w-5 h-5 mr-2" />
                    Custom CSS Editor
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Edit the CSS and watch it update live!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="w-full h-40 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
                    spellCheck={false}
                    placeholder="/* Your custom CSS here */"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    <p>💡 Changes apply instantly to the preview</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Stream Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-sm">OBS Browser Source</span>
                    <Badge className="bg-green-600 text-white">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-sm">Transparent Background</span>
                    <Badge className="bg-green-600 text-white">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-sm">Auto-updates</span>
                    <Badge className="bg-green-600 text-white">Live</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stream Preview - Actually looks like the real thing now */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="bg-red-600 text-white">🔴 Live Stream Preview</Badge>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] relative overflow-hidden border border-gray-700">
                {/* Game background simulation */}
                <div className="absolute inset-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MonitorSpeaker className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your Game/Content Here</p>
                    <p className="text-xs opacity-75">Overlay appears on top</p>
                  </div>
                </div>

                {/* Actual Stream Overlay - positioned like real stream */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div
                    className="stream-overlay p-4 rounded-xl text-white shadow-2xl max-w-sm w-full backdrop-blur-sm"
                    style={{
                      background: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      ...parseInlineCSS(customCSS)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Album art - real stream size */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                      </div>

                      {/* Track info - exactly like real stream */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-base drop-shadow-lg flex items-center mb-1">
                          {!isPlaying && (
                            <Pause className="h-4 w-4 mr-2 text-white/70 flex-shrink-0" />
                          )}
                          <span className="truncate">{demoTrack.name}</span>
                        </div>

                        <div className="text-gray-200 text-sm drop-shadow-lg truncate mb-2">
                          {demoTrack.artist}
                        </div>

                        {/* Progress Bar - real stream styling */}
                        <div className="space-y-1">
                          <div className="w-full bg-black/40 rounded-full h-1">
                            <div
                              className="bg-white h-1 rounded-full transition-all duration-300 shadow-sm"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-300 drop-shadow-lg">
                            <span>{Math.floor(progress * 3.33 / 100)}:{String(Math.floor((progress * 2) % 60)).padStart(2, '0')}</span>
                            <span>{demoTrack.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating indicator */}
                <div className="absolute top-4 right-4">
                  <div className="bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    LIVE
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => window.open('/stream/wthlaw', '_blank')}
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open real stream overlay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Message */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-xl">LH</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-xl font-bold text-white">Hey, I'm Lawson!</h3>
                    <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">Developer</Badge>
                  </div>

                  <div className="prose prose-gray text-gray-300 space-y-4">
                    <p>
                      I built JamLog because I was frustrated with existing music display tools. They were either too expensive,
                      had terrible UIs, or just didn't work well for streaming.
                    </p>

                    <p>
                      What started as a weekend project to show my music on my desktop wallpaper turned into something way cooler -
                      especially the stream overlay mode with custom CSS support. That's honestly my favorite part.
                    </p>

                    <p>
                      I'm constantly adding new themes and features. Got ideas? Hit me up on Twitter or GitHub.
                      This is a passion project and I love hearing what people want to see next.
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-6">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Coffee className="w-4 h-4 mr-2" />
                      Buy me coffee
                    </Button>
                    <Link href="https://twitter.com/lawsonhart" className="text-blue-400 hover:text-blue-300 text-sm">
                      @lawsonhart
                    </Link>
                    <Link href="https://github.com/oyuh" className="text-gray-400 hover:text-gray-300 text-sm">
                      GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What you get (for free)</h2>
            <p className="text-gray-400">No tricks, no premium tiers - just good software</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "65+ Themes",
                description: "From minimal to psychedelic, all included",
                badge: "All included"
              },
              {
                icon: Brush,
                title: "Custom CSS",
                description: "Full control over styling for power users",
                badge: "Advanced"
              },
              {
                icon: Image,
                title: "Background Images",
                description: "Upload your own images or use gradients",
                badge: "Personal"
              },
              {
                icon: Shield,
                title: "Privacy Controls",
                description: "Custom URLs, hide your Spotify ID",
                badge: "Secure"
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Changes instantly when you switch songs",
                badge: "Live"
              },
              {
                icon: MonitorSpeaker,
                title: "Stream Ready",
                description: "Perfect for OBS with transparent backgrounds",
                badge: "Streaming"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <feature.icon className="w-8 h-8 text-green-400" />
                    <Badge className="bg-gray-700 text-gray-300 text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-8 border border-green-500/20">
            <h2 className="text-4xl font-bold mb-4">
              Ready to make something cool?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect your Spotify and start creating beautiful music displays in under 30 seconds
            </p>

            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => signIn("spotify")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg px-12 py-6 rounded-xl"
              >
                <Music className="w-5 h-5 mr-2" />
                Connect Spotify & Start
              </Button>

              <p className="text-gray-500 text-sm">
                Takes 10 seconds • No signup required • Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Headphones className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="font-bold text-xl">Spotify Util</h3>
                <p className="text-gray-400 text-sm">Made by a dev, for devs & streamers</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-400" />
                Built with Next.js
              </span>
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-blue-400" />
                Secure & Private
              </span>
              <Link href="https://github.com/oyuh/spotify-util" className="hover:text-green-400 transition-colors">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-500">
            <p>© 2024 Spotify Util. Not affiliated with Spotify AB.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
