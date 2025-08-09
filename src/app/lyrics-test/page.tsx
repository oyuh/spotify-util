"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LyricsTestPage() {
  const [testSlug, setTestSlug] = useState("")
  const [lyricsEnabled, setLyricsEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleLyrics = async () => {
    if (!testSlug.trim()) {
      alert("Please enter a test slug first")
      return
    }

    setLoading(true)
    try {
      // For now, we'll just simulate the preference update
      // In a real app, you'd update the user's preferences via API
      setLyricsEnabled(!lyricsEnabled)
      console.log(`Lyrics ${lyricsEnabled ? 'disabled' : 'enabled'} for ${testSlug}`)
    } catch (error) {
      console.error("Error toggling lyrics:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Lyrics Feature Testing</h1>
          <p className="text-muted-foreground">
            Test the new lyrics functionality for both display and stream pages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Page Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Display Page Lyrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-slug">Test Slug/Identifier</Label>
                <Input
                  id="test-slug"
                  value={testSlug}
                  onChange={(e) => setTestSlug(e.target.value)}
                  placeholder="Enter your display identifier"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lyrics-toggle"
                  checked={lyricsEnabled}
                  onCheckedChange={() => handleToggleLyrics()}
                  disabled={loading}
                />
                <Label htmlFor="lyrics-toggle">
                  Show lyrics on display page
                </Label>
              </div>

              {testSlug && (
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    disabled={!testSlug.trim()}
                  >
                    <a 
                      href={`/display/${testSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Display Page
                    </a>
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    {lyricsEnabled 
                      ? "✅ Lyrics will appear on the left side of the track display"
                      : "❌ Lyrics are disabled - only track and recent tracks will show"
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stream Page Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Lyrics Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Stream lyrics are always available as a separate overlay page
                </p>
                
                {testSlug && (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      disabled={!testSlug.trim()}
                    >
                      <a 
                        href={`/stream/${testSlug}/lyrics`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Stream Lyrics Overlay
                      </a>
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      disabled={!testSlug.trim()}
                    >
                      <a 
                        href={`/stream/${testSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Regular Stream Overlay
                      </a>
                    </Button>
                  </>
                )}
                
                <p className="text-xs text-muted-foreground">
                  🎵 Stream lyrics have transparent background and support custom CSS
                </p>
              </div>

              <div className="bg-muted p-3 rounded text-xs">
                <strong>Stream URLs:</strong><br/>
                <code>/stream/{testSlug || '{slug}'}</code> - Regular overlay<br/>
                <code>/stream/{testSlug || '{slug}'}/lyrics</code> - Lyrics overlay
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Testing */}
        <Card>
          <CardHeader>
            <CardTitle>API Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Lyrics API</h4>
                {testSlug && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a 
                      href={`/api/lyrics/${testSlug}?track=Test%20Song&artist=Test%20Artist&progress=30000`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Test Lyrics API
                    </a>
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Returns synchronized lyrics data with timing
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Display API</h4>
                {testSlug && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a 
                      href={`/api/public/display/${testSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Test Display API
                    </a>
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Returns track data with preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Lyrics API with multiple service integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Settings toggle for enabling lyrics on display</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Stream lyrics page with transparent background</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Display page lyrics integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Real-time progress synchronization</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">API Configuration</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>📋 <strong>Musixmatch:</strong> Free tier (2000 requests/day, unsynced lyrics)</p>
                  <p>📋 <strong>Genius:</strong> Free tier (metadata only, no lyrics content)</p>
                  <p>📋 <strong>LyricsFind:</strong> Premium service (synchronized timing data)</p>
                </div>
                <div className="mt-2 p-2 bg-muted rounded text-xs">
                  <p>🔧 <strong>Setup:</strong> Copy <code>.env.example</code> to <code>.env.local</code> and add your API keys</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Current Status</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⚠️</span>
                    <span>Using enhanced mock lyrics (realistic demo data)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🔧</span>
                    <span>Add API keys to enable real lyrics fetching</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
