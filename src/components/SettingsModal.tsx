'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Copy, Settings, Eye, EyeOff, Shuffle, Link as LinkIcon, Palette, Monitor, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { displayStyles } from '@/lib/app-themes'
import { testImageUrl } from '@/lib/utils'

interface UserPreferences {
  publicDisplaySettings: {
    showCurrentTrack: boolean
    showRecentTracks: boolean
    showArtist: boolean
    showAlbum: boolean
    showDuration: boolean
    showProgress: boolean
    showCredits: boolean
    numberOfRecentTracks: number
  }
  privacySettings: {
    isPublic: boolean
    customSlug?: string
    hideSpotifyId: boolean
  }
  displaySettings: {
    style: string
    customCSS?: string
    backgroundImage?: string
    streamerMode: boolean
    position?: {
      x: number
      y: number
    }
  }
}

interface SettingsModalProps {
  children: React.ReactNode
  isFullVersion?: boolean
}

export default function SettingsModal({ children, isFullVersion = false }: SettingsModalProps) {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences>({
    publicDisplaySettings: {
      showCurrentTrack: true,
      showRecentTracks: false,
      showArtist: true,
      showAlbum: true,
      showDuration: true,
      showProgress: true,
      showCredits: false,
      numberOfRecentTracks: 5
    },
    privacySettings: {
      isPublic: true,
      customSlug: '',
      hideSpotifyId: false
    },
    displaySettings: {
      style: 'minimal',
      customCSS: '',
      backgroundImage: '',
      streamerMode: false
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageTestResult, setImageTestResult] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle')

  // Load user preferences
  useEffect(() => {
    if (session?.user) {
      loadPreferences()
    }
  }, [session])

  const loadPreferences = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      // Validate privacy settings
      if (!preferences.privacySettings.isPublic && !preferences.privacySettings.customSlug) {
        toast.error('Private mode requires a custom slug. Please generate one first.')
        return
      }

      setIsSaving(true)
      console.log('Client - About to save preferences:', JSON.stringify(preferences, null, 2))

      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      console.log('Client - Save response status:', response.status)

      if (response.ok) {
        const responseData = await response.json()
        console.log('Client - Save success:', responseData)
        toast.success('Settings saved successfully!')
      } else {
        const errorData = await response.json()
        console.error('Client - Save failed:', errorData)
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save preferences:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const generateCustomSlug = async () => {
    try {
      const response = await fetch('/api/user/generate-slug', {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setPreferences(prev => ({
          ...prev,
          privacySettings: {
            ...prev.privacySettings,
            customSlug: data.slug
          }
        }))
        toast.success('Custom link generated!')
      }
    } catch (error) {
      console.error('Failed to generate slug:', error)
      toast.error('Failed to generate custom link')
    }
  }

  const testBackgroundImage = async (url: string) => {
    if (!url.trim()) {
      setImageTestResult('idle')
      return
    }

    setImageTestResult('testing')
    try {
      const isValid = await testImageUrl(url)
      setImageTestResult(isValid ? 'valid' : 'invalid')

      if (isValid) {
        toast.success('Image URL is valid!')
      } else {
        toast.error('Image URL failed to load. Please check the URL and try again.')
      }
    } catch (error) {
      setImageTestResult('invalid')
      toast.error('Failed to test image URL')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const getDisplayUrl = () => {
    const baseUrl = window.location.origin
    if (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug) {
      // Private mode: use public slug endpoint
      return `${baseUrl}/api/public/display/${preferences.privacySettings.customSlug}`
    } else if (preferences.privacySettings.customSlug) {
      // Public mode with custom slug: still use public endpoint for consistency
      return `${baseUrl}/api/public/display/${preferences.privacySettings.customSlug}`
    } else {
      // Public mode without custom slug: use regular endpoint
      return `${baseUrl}/api/display/${session?.spotifyId}`
    }
  }

  const getStreamUrl = () => {
    const baseUrl = window.location.origin
    if (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug) {
      // Private mode: use public slug endpoint
      return `${baseUrl}/api/public/stream/${preferences.privacySettings.customSlug}`
    } else if (preferences.privacySettings.customSlug) {
      // Public mode with custom slug: still use public endpoint for consistency
      return `${baseUrl}/api/public/stream/${preferences.privacySettings.customSlug}`
    } else {
      // Public mode without custom slug: use regular endpoint
      return `${baseUrl}/api/stream/${session?.spotifyId}`
    }
  }

  const getPublicDisplayUrl = () => {
    const baseUrl = window.location.origin
    if (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug) {
      // Private mode: use slug display page
      return `${baseUrl}/display/${preferences.privacySettings.customSlug}`
    } else if (preferences.privacySettings.customSlug) {
      // Public mode with custom slug: still use slug for consistency
      return `${baseUrl}/display/${preferences.privacySettings.customSlug}`
    } else {
      // Public mode without custom slug: use regular display page
      return `${baseUrl}/display/${session?.spotifyId}`
    }
  }

  if (!session) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isFullVersion ? 'w-full' : ''}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings & Preferences
          </DialogTitle>
          <DialogDescription>
            Customize how your music data is displayed and shared
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>

          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Display Options
                </CardTitle>
                <CardDescription>
                  Choose what information to show in your public display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-name">Track Name</Label>
                    <Switch
                      id="display-name"
                      checked={preferences.publicDisplaySettings.showCurrentTrack}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showCurrentTrack: checked
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-artist">Artist</Label>
                    <Switch
                      id="display-artist"
                      checked={preferences.publicDisplaySettings.showArtist}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showArtist: checked
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-album">Album</Label>
                    <Switch
                      id="display-album"
                      checked={preferences.publicDisplaySettings.showAlbum}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showAlbum: checked
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-duration">Duration</Label>
                    <Switch
                      id="display-duration"
                      checked={preferences.publicDisplaySettings.showDuration}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showDuration: checked
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-progress">Progress</Label>
                    <Switch
                      id="display-progress"
                      checked={preferences.publicDisplaySettings.showProgress}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showProgress: checked
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-credits">Track Credits</Label>
                    <Switch
                      id="display-credits"
                      checked={preferences.publicDisplaySettings.showCredits}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showCredits: checked
                          }
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-recent">Recent Tracks</Label>
                    <Switch
                      id="display-recent"
                      checked={preferences.publicDisplaySettings.showRecentTracks}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showRecentTracks: checked
                          }
                        }))
                      }
                    />
                  </div>
                  {preferences.publicDisplaySettings.showRecentTracks && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recent-count">Number of Recent Tracks</Label>
                        <span className="text-sm text-muted-foreground font-medium">
                          {preferences.publicDisplaySettings.numberOfRecentTracks}
                        </span>
                      </div>
                      <Slider
                        id="recent-count"
                        min={5}
                        max={50}
                        step={5}
                        value={[preferences.publicDisplaySettings.numberOfRecentTracks]}
                        onValueChange={(value) =>
                          setPreferences(prev => ({
                            ...prev,
                            publicDisplaySettings: {
                              ...prev.publicDisplaySettings,
                              numberOfRecentTracks: value[0]
                            }
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5</span>
                        <span>50</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control how your music data can be accessed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private-mode">Private Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, your display is only accessible via the generated slug URL
                    </p>
                  </div>
                  <Switch
                    id="private-mode"
                    checked={!preferences.privacySettings.isPublic}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          isPublic: !checked
                        }
                      }))
                    }
                  />
                </div>

                {!preferences.privacySettings.isPublic && (
                  <>
                    <Separator />
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-600">Private Mode Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your display is only accessible via the custom slug URL below. Your regular Spotify ID link will not work.
                      </p>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <div>
                    <Label>Custom Slug {!preferences.privacySettings.isPublic && <span className="text-red-500">*</span>}</Label>
                    <p className="text-sm text-muted-foreground">
                      {preferences.privacySettings.isPublic
                        ? "Optional custom URL that works alongside your regular link"
                        : "Required for private mode - this is the only way to access your display"
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={!preferences.privacySettings.isPublic ? "Required for private mode" : "Custom slug (optional)"}
                      value={preferences.privacySettings.customSlug || ''}
                      onChange={(e) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacySettings: {
                            ...prev.privacySettings,
                            customSlug: e.target.value
                          }
                        }))
                      }
                      className={!preferences.privacySettings.isPublic && !preferences.privacySettings.customSlug ? "border-red-300" : ""}
                    />
                    <Button variant="outline" onClick={generateCustomSlug}>
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  {preferences.privacySettings.customSlug && (
                    <div className="space-y-2">
                      <Badge variant={preferences.privacySettings.isPublic ? "secondary" : "destructive"} className="break-all">
                        {preferences.privacySettings.isPublic ? "Custom slug: " : "Private URL: "}
                        {preferences.privacySettings.customSlug}
                      </Badge>
                      {!preferences.privacySettings.isPublic && (
                        <p className="text-xs text-muted-foreground">
                          Share this slug carefully - it's the only way to access your display
                        </p>
                      )}
                    </div>
                  )}
                  {!preferences.privacySettings.isPublic && !preferences.privacySettings.customSlug && (
                    <p className="text-sm text-red-600">
                      ⚠️ You must generate a custom slug to use private mode
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Public Links
                </CardTitle>
                <CardDescription>
                  Share these links to display your music data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Endpoint (for custom implementations)</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getDisplayUrl()}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getDisplayUrl(), 'API URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Streaming Overlay (for OBS/streaming)</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getStreamUrl()}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getStreamUrl(), 'Stream URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Public Display Page</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getPublicDisplayUrl()}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getPublicDisplayUrl(), 'Display URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Themes & Styling
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your public display and streaming overlay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Theme Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Display Style</Label>
                  <p className="text-xs text-muted-foreground">Style for public display pages</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {displayStyles.slice(0, 6).map((style) => (
                      <div
                        key={style.id}
                        className={`cursor-pointer p-3 rounded-lg border transition-all hover:scale-105 ${
                          preferences.displaySettings.style === style.id
                            ? 'ring-2 ring-primary border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={async () => {
                          setPreferences(prev => ({
                            ...prev,
                            displaySettings: {
                              ...prev.displaySettings,
                              style: style.id
                            }
                          }))

                          // Save to server immediately
                          try {
                            const response = await fetch('/api/user/display-style', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                styleId: style.id,
                                customCSS: preferences.displaySettings.customCSS
                              }),
                            })

                            if (response.ok) {
                              toast.success(`Display style changed to ${style.name}`)
                            } else {
                              toast.error('Failed to save display style')
                            }
                          } catch (error) {
                            console.error('Error saving display style:', error)
                            toast.error('Failed to save display style')
                          }
                        }}
                      >
                        <div
                          className="w-full h-8 rounded mb-2 border"
                          style={{ background: style.preview }}
                        ></div>
                        <div className="text-xs font-medium">{style.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Show more styles */}
                  {displayStyles.length > 6 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                      {displayStyles.slice(6).map((style) => (
                        <div
                          key={style.id}
                          className={`cursor-pointer p-3 rounded-lg border transition-all hover:scale-105 ${
                            preferences.displaySettings.style === style.id
                              ? 'ring-2 ring-primary border-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={async () => {
                            setPreferences(prev => ({
                              ...prev,
                              displaySettings: {
                                ...prev.displaySettings,
                                style: style.id
                              }
                            }))

                            // Save to server immediately
                            try {
                              const response = await fetch('/api/user/display-style', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  styleId: style.id,
                                  customCSS: preferences.displaySettings.customCSS
                                }),
                              })

                              if (response.ok) {
                                toast.success(`Display style changed to ${style.name}`)
                              } else {
                                toast.error('Failed to save display style')
                              }
                            } catch (error) {
                              console.error('Error saving display style:', error)
                              toast.error('Failed to save display style')
                            }
                          }}
                        >
                          <div
                            className="w-full h-8 rounded mb-2 border"
                            style={{ background: style.preview }}
                          ></div>
                          <div className="text-xs font-medium">{style.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Streaming Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="streaming-mode">Streaming Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimized for OBS with transparent background
                    </p>
                  </div>
                  <Switch
                    id="streaming-mode"
                    checked={preferences.displaySettings.streamerMode}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        displaySettings: {
                          ...prev.displaySettings,
                          streamerMode: checked
                        }
                      }))
                    }
                  />
                </div>

                <Separator />

                {/* Custom Background Image - DISABLED FOR PRODUCTION */}
                <div className="space-y-2 opacity-50">
                  <Label htmlFor="background-image">Background Image</Label>
                  <p className="text-xs text-amber-600 font-medium">
                    🚧 Coming Soon - Background images are currently being improved and will be available in a future update.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="background-image"
                      type="url"
                      placeholder="Feature coming soon..."
                      disabled={true}
                      value=""
                      className="cursor-not-allowed"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={true}
                      className="cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Background images will support Imgur, Unsplash, Discord CDN, GitHub, and other trusted image hosts</p>
                    <p>Note: This feature is being optimized for better performance and reliability</p>
                  </div>
                </div>

                {/* Custom CSS */}
                {isFullVersion && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="custom-css">Custom CSS</Label>
                      <p className="text-xs text-muted-foreground">
                        Add custom styles to override theme defaults (advanced users only)
                      </p>
                      <textarea
                        id="custom-css"
                        className="w-full h-32 p-3 text-sm font-mono border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="/* Add your custom CSS here */
.track-display {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
}"
                        value={preferences.displaySettings.customCSS || ''}
                        onChange={(e) =>
                          setPreferences(prev => ({
                            ...prev,
                            displaySettings: {
                              ...prev.displaySettings,
                              customCSS: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={loadPreferences} disabled={isLoading}>
            Reset
          </Button>
          <Button onClick={savePreferences} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
