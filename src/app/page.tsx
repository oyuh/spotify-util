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
  ExternalLink, Github, Coffee, Heart, Wrench, Terminal, Clock, ArrowRight,
  CheckCircle, Lightbulb, Settings, Download
} from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Footer from "@/components/Footer"

function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(33)
  const [customCSS, setCustomCSS] = useState(`.music-overlay .track-title {
  color: #22c55e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.music-overlay .track-artist {
  color: #a855f7;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}`)

  const [demoTrack, setDemoTrack] = useState({
    name: "Good Time",
    artist: "Alan Jackson",
    album: "Good Time",
    duration: "3:20"
  })

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
      const rules = css.match(/[^{}]+\{[^{}]*\}/g) || []
      rules.forEach(rule => {
        const [selector, declarations] = rule.split('{')
        const decls = declarations.replace('}', '').split(';')
        decls.forEach(decl => {
          const [prop, value] = decl.split(':')
          if (prop && value) {
            const camelProp = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase())
            styles[camelProp] = value.trim()
          }
        })
      })
    } catch (e) {
      // If parsing fails, return empty object
    }
    return styles
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <Music className="absolute inset-0 m-auto h-6 w-6 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Spotify displays that don't suck
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Finally, music widgets that look good on streams and desktops.
              No subscription bullshit, just connect Spotify and go.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => signIn("spotify")}
              className="text-lg px-8 py-6"
            >
              <Music className="w-5 h-5 mr-2" />
              Connect Spotify
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('/display/wthlaw', '_blank')}
              className="text-lg px-8 py-6"
            >
              <Eye className="w-5 h-5 mr-2" />
              See example
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>65+ themes included</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Updates in real-time</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Custom CSS support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Display Demo */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Try the display builder
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Pick a theme, customize your track</h2>
            <p className="text-muted-foreground text-lg">
              Live preview of what your display will look like
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Theme Selector
                  </CardTitle>
                  <CardDescription>
                    Choose from 65+ built-in themes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTheme(index)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTheme === index
                            ? 'border-primary bg-muted'
                            : 'border-border hover:border-muted-foreground'
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Track Preview
                  </CardTitle>
                  <CardDescription>
                    Customize what shows in the demo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Song name"
                    value={demoTrack.name}
                    onChange={(e) => setDemoTrack({...demoTrack, name: e.target.value})}
                  />
                  <Input
                    placeholder="Artist"
                    value={demoTrack.artist}
                    onChange={(e) => setDemoTrack({...demoTrack, artist: e.target.value})}
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">

              <div
                className="rounded-xl p-6 min-h-[500px] flex items-center justify-center relative overflow-hidden border"
                style={{
                  background: themes[selectedTheme].bg
                }}
              >
                {/* Display Recreation */}
                <div className="w-full max-w-md">
                  <Card className="bg-background/95 backdrop-blur border shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center space-y-6">
                        {/* Album Art */}
                        <div className="relative group">
                          <div className="w-48 h-48 rounded-xl shadow-xl bg-muted flex items-center justify-center border">
                            <Music className="w-16 h-16 text-muted-foreground" />
                          </div>
                          {isPlaying && (
                            <div className="absolute inset-0 rounded-xl border-4 border-primary animate-pulse"></div>
                          )}
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            {isPlaying ? <Play className="w-3 h-3 text-primary-foreground fill-current" /> : <Pause className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="w-full space-y-3">
                          <h1 className="text-2xl font-bold leading-tight">
                            {demoTrack.name}
                          </h1>
                          <p className="text-lg text-muted-foreground">{demoTrack.artist}</p>
                          <p className="text-md text-muted-foreground">
                            from <span className="font-semibold">{demoTrack.album}</span>
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-2 w-full pt-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}></div>
                              <span className="text-sm font-medium">
                                {isPlaying ? 'Now Playing' : 'Paused'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Updated {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Powered by */}
                      <div className="mt-6 pt-4 border-t text-center">
                        <p className="text-xs text-muted-foreground">
                          Powered by <span className="font-semibold">JamLog</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={() => window.open('/display/wthlaw', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open real display
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stream Mode Interactive Demo */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Radio className="w-4 h-4 mr-2" />
              Stream overlays that don't look like trash
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Custom CSS for your stream</h2>
            <p className="text-muted-foreground text-lg">
              Edit CSS live and watch it update in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CSS Editor */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code2 className="w-5 h-5 mr-2" />
                    CSS Editor
                  </CardTitle>
                  <CardDescription>
                    Write custom CSS and see it applied instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="w-full h-40 bg-muted text-foreground font-mono text-sm p-3 rounded border border-input focus:border-ring focus:outline-none resize-none"
                    spellCheck={false}
                    placeholder="/* Your custom CSS here */"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Changes apply instantly to the preview below
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Stream Integration
                  </CardTitle>
                  <CardDescription>
                    Perfect for OBS and streaming software
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm">OBS Browser Source</span>
                    <Badge>Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm">Transparent Background</span>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm">Real-time Updates</span>
                    <Badge>Live</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stream Preview */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="destructive">🔴 Stream Preview</Badge>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 min-h-[400px] relative overflow-hidden border">
                {/* Simulated game content */}
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MonitorSpeaker className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your Game/Content Here</p>
                    <p className="text-xs opacity-75">Music overlay appears on top</p>
                  </div>
                </div>

                {/* Minimal Stream Overlay - NO CARD, just like the real one */}
                <div className="absolute bottom-6 left-6 z-10">
                  <div className="flex items-center space-x-3 max-w-xs w-full">
                    {/* Album art - minimal like real stream */}
                    <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    </div>

                    {/* Track info - exactly like real stream */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-bold text-white text-base drop-shadow-lg flex items-center mb-1 track-title"
                        style={parseInlineCSS(customCSS)}
                      >
                        {!isPlaying && (
                          <Pause className="h-4 w-4 mr-1 text-white/70 flex-shrink-0" />
                        )}
                        <span className="truncate">{demoTrack.name}</span>
                      </div>

                      <div
                        className="text-gray-200 text-sm drop-shadow-lg truncate mb-2 track-artist"
                        style={parseInlineCSS(customCSS)}
                      >
                        {demoTrack.artist}
                      </div>

                      {/* Progress Bar - minimal like real stream */}
                      <div className="mt-2 space-y-1">
                        <div className="w-full bg-black/40 rounded-full h-1">
                          <div
                            className="bg-white h-1 rounded-full transition-all duration-300"
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

                {/* Live indicator */}
                <div className="absolute top-4 right-4">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    LIVE
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={() => window.open('/stream/wthlaw', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open real stream overlay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What you actually get</h2>
            <p className="text-muted-foreground text-lg">
              No premium tiers, no hidden fees, just good software
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "65+ Themes",
                description: "Every theme is included, from minimal to wild",
                badge: "All Free"
              },
              {
                icon: Code2,
                title: "Custom CSS",
                description: "Full control over styling for power users",
                badge: "Advanced"
              },
              {
                icon: Image,
                title: "Custom Backgrounds",
                description: "Upload your own images or use gradients",
                badge: "Personal"
              },
              {
                icon: Shield,
                title: "Privacy Controls",
                description: "Custom URLs, hide your info",
                badge: "Secure"
              },
              {
                icon: Zap,
                title: "Real-time Sync",
                description: "Updates instantly when you change songs",
                badge: "Live"
              },
              {
                icon: MonitorSpeaker,
                title: "Stream Ready",
                description: "Perfect for OBS with transparent backgrounds",
                badge: "Streaming"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:bg-muted/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-4xl font-bold mb-4">
                Ready to make something cool?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect Spotify and start creating displays in under 30 seconds
              </p>

              <div className="space-y-4">
                <Button size="lg" onClick={() => signIn("spotify")} className="text-lg px-12 py-6">
                  <Music className="w-5 h-5 mr-2" />
                  Connect Spotify & Start
                </Button>

                <p className="text-muted-foreground text-sm">
                  Takes 10 seconds • No signup required • Free forever
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
