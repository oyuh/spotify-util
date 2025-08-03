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
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Copy, Settings, Eye, EyeOff, Shuffle, Link as LinkIcon, Palette, Monitor } from 'lucide-react'
import { toast } from 'sonner'

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
    theme: string
    customCSS?: string
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
      theme: 'default',
      customCSS: '',
      streamerMode: false
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const getDisplayUrl = () => {
    const baseUrl = window.location.origin
    const identifier = preferences.privacySettings.customSlug || session?.spotifyId
    return `${baseUrl}/api/display/${identifier}`
  }

  const getStreamUrl = () => {
    const baseUrl = window.location.origin
    const identifier = preferences.privacySettings.customSlug || session?.spotifyId
    return `${baseUrl}/api/stream/${identifier}`
  }

  const getPublicDisplayUrl = () => {
    const baseUrl = window.location.origin
    const identifier = preferences.privacySettings.customSlug || session?.spotifyId
    return `${baseUrl}/display/${identifier}`
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
                    <div className="space-y-2">
                      <Label htmlFor="recent-count">Number of Recent Tracks</Label>
                      <Input
                        id="recent-count"
                        type="number"
                        min="1"
                        max="20"
                        value={preferences.publicDisplaySettings.numberOfRecentTracks}
                        onChange={(e) =>
                          setPreferences(prev => ({
                            ...prev,
                            publicDisplaySettings: {
                              ...prev.publicDisplaySettings,
                              numberOfRecentTracks: parseInt(e.target.value) || 5
                            }
                          }))
                        }
                      />
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
                  Control who can see your music data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-display">Public Display</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to view your currently playing track
                    </p>
                  </div>
                  <Switch
                    id="public-display"
                    checked={preferences.privacySettings.isPublic}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          isPublic: checked
                        }
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Custom Private Link</Label>
                    <p className="text-sm text-muted-foreground">
                      Create a custom URL that's not tied to your Spotify ID
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Custom slug (optional)"
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
                    />
                    <Button variant="outline" onClick={generateCustomSlug}>
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  {preferences.privacySettings.customSlug && (
                    <Badge variant="secondary" className="break-all">
                      Using custom slug: {preferences.privacySettings.customSlug}
                    </Badge>
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
                  Custom Styling
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your public display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {isFullVersion && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="custom-css">Custom CSS</Label>
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
