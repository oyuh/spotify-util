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
  ExternalLink, Github, Coffee, Heart, Wrench, Terminal
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
      name: "Neon Green", 
      bg: "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
      text: "text-black",
      accent: "#00ff88"
    },
    { 
      name: "Cyberpunk", 
      bg: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
      text: "text-white",
      accent: "#ff0080"
    },
    { 
      name: "Aurora", 
      bg: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #FF0080 100%)",
      text: "text-white",
      accent: "#00C9FF"
    },
    { 
      name: "Matrix", 
      bg: "linear-gradient(135deg, #003300 0%, #00ff00 100%)",
      text: "text-green-100",
      accent: "#00ff00"
    }
  ]

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Developer-style header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-md flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">JamLog</h1>
                <p className="text-xs text-gray-400">v2.1.0 • Now with 65+ themes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/oyuh/spotify-util" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Button 
                onClick={() => signIn("spotify")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Login with Spotify
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - More authentic */}
      <section ref={heroRef} className="container mx-auto px-4 py-16">
        <div className="hero-content max-w-4xl">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <code className="text-green-400 text-sm font-mono bg-gray-800 px-2 py-1 rounded">
              npm install music-visualization
            </code>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Turn your Spotify into
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              beautiful displays
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            A tool I built to create stunning music displays for streaming, wallpapers, or just showing off your taste. 
            Works with your Spotify account and updates in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => signIn("spotify")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold"
            >
              <Music className="w-5 h-5 mr-2" />
              Try it free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('/display/wthlaw', '_blank')}
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
            >
              <Eye className="w-5 h-5 mr-2" />
              See live example
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>65+ themes included</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Custom CSS support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Display Demo */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Try the display builder</h2>
            <p className="text-gray-400">Pick a theme and see how your music would look</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Theme Selector</CardTitle>
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
                  <CardTitle className="text-lg">Custom Track (Demo)</CardTitle>
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
                    <p>💡 This is just a demo - real version uses your actual Spotify data</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-600 text-white">Live Preview</Badge>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                {/* Background with selected theme */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ background: themes[selectedTheme].bg }}
                ></div>
                
                {/* Music Display */}
                <div className="relative z-10 max-w-sm w-full">
                  <div 
                    className={`p-6 rounded-xl backdrop-blur-sm border shadow-xl ${themes[selectedTheme].text}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${themes[selectedTheme].accent}20, transparent)`,
                      borderColor: themes[selectedTheme].accent + '40'
                    }}
                  >
                    {/* Album Art */}
                    <div 
                      className="w-32 h-32 mx-auto mb-4 rounded-lg shadow-lg"
                      style={{ background: themes[selectedTheme].bg }}
                    ></div>

                    {/* Track Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-1">{demoTrack.name}</h3>
                      <p className="opacity-75">{demoTrack.artist}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <SkipForward className="w-4 h-4 rotate-180" />
                      </button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-100 rounded-full"
                          style={{ 
                            width: `${progress}%`,
                            background: themes[selectedTheme].accent
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs opacity-75">
                        <span>{Math.floor(progress * 3.33 / 100)}:{String(Math.floor((progress * 2) % 60)).padStart(2, '0')}</span>
                        <span>{demoTrack.duration}</span>
                      </div>
                    </div>
                  </div>
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
                    {theme.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{theme.category}</p>
                </div>
              </div>
            ))}
      {/* Stream Mode Interactive Demo */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500 text-white px-4 py-2">
              <Radio className="w-4 h-4 mr-2" />
              Stream Mode
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Custom CSS Stream Overlays</h2>
            <p className="text-gray-400">This is what I'm really excited about - fully customizable stream overlays</p>
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
                </CardHeader>
                <CardContent>
                  <textarea
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="w-full h-40 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
                    spellCheck={false}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    <p>💡 Change the CSS above to see live updates in the preview</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Stream Integration</CardTitle>
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

            {/* Stream Preview */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="bg-red-600 text-white">Live Stream Preview</Badge>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 min-h-[400px] relative overflow-hidden">
                {/* Simulated game content */}
                <div className="absolute inset-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MonitorSpeaker className="w-12 h-12 mx-auto mb-2" />
                    <p>Your Game/Content</p>
                  </div>
                </div>

                {/* Music overlay with custom CSS applied */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div 
                    className="music-overlay p-4 max-w-xs text-white"
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid #22c55e',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                      ...parseInlineCSS(customCSS)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Album art */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex-shrink-0"></div>
                      
                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          {demoTrack.name}
                        </div>
                        <div className="text-xs opacity-75">{demoTrack.artist}</div>
                        
                        {/* Progress bar */}
                        <div className="mt-2">
                          <div className="w-full bg-white/20 rounded-full h-1">
                            <div 
                              className="bg-green-400 h-1 rounded-full transition-all duration-100"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
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
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-md flex items-center justify-center mr-3">
                <Music className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-white font-bold">JamLog</span>
                <p className="text-xs text-gray-500">Made with <Heart className="w-3 h-3 inline text-red-400" /> by Lawson</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Terms
              </Link>
              <Link href="/support" className="hover:text-green-400 transition-colors">
                Support
              </Link>
              <Link href="https://github.com/oyuh/spotify-util" className="hover:text-green-400 transition-colors">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )

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
}

export default Home
