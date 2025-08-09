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
    showLyrics: boolean
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
      showLyrics: false,
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
      backgroundImage: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageTestResult, setImageTestResult] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle')
  const [slugCheckResult, setSlugCheckResult] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter styles based on selected category
  const filteredStyles = selectedCategory === 'all'
    ? displayStyles
    : displayStyles.filter(style => style.category === selectedCategory)

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

      // Check if custom slug is taken before saving
      if (preferences.privacySettings.customSlug && slugCheckResult === 'taken') {
        toast.error('Cannot save: The custom slug is already taken. Please choose a different one.')
        return
      }

      // Check slug format if provided
      if (preferences.privacySettings.customSlug && slugCheckResult === 'invalid') {
        toast.error('Cannot save: Invalid slug format. Use only lowercase letters, numbers, and hyphens.')
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

        // Handle specific error cases
        if (response.status === 409) {
          toast.error(errorData.error || 'This custom slug is already taken. Please choose a different one.')
          setSlugCheckResult('taken')
        } else if (response.status === 400) {
          toast.error(errorData.error || 'Invalid settings data')
        } else {
          toast.error('Failed to save settings')
        }
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
      setSlugCheckResult('checking')
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
        setSlugCheckResult('available')
        toast.success('Custom link generated!')
      } else {
        setSlugCheckResult('idle')
        toast.error('Failed to generate custom link')
      }
    } catch (error) {
      console.error('Failed to generate slug:', error)
      setSlugCheckResult('idle')
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

  const checkSlugAvailability = async (slug: string) => {
    if (!slug.trim()) {
      setSlugCheckResult('idle')
      return
    }

    // Basic slug validation
    if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
      setSlugCheckResult('invalid')
      return
    }

    setSlugCheckResult('checking')
    try {
      const response = await fetch('/api/user/check-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })

      if (response.ok) {
        const data = await response.json()
        setSlugCheckResult(data.available ? 'available' : 'taken')
      } else {
        setSlugCheckResult('idle')
      }
    } catch (error) {
      console.error('Failed to check slug availability:', error)
      setSlugCheckResult('idle')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const getDisplayUrl = () => {
    const baseUrl = window.location.origin
    // Determine the correct identifier based on privacy settings
    const identifier = (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug)
      ? preferences.privacySettings.customSlug
      : (preferences.privacySettings.customSlug || session?.spotifyId)

    return `${baseUrl}/display/${identifier}`
  }

  const getStreamUrl = () => {
    const baseUrl = window.location.origin
    // Determine the correct identifier based on privacy settings
    const identifier = (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug)
      ? preferences.privacySettings.customSlug
      : (preferences.privacySettings.customSlug || session?.spotifyId)

    return `${baseUrl}/stream/${identifier}`
  }

  const getPublicDisplayUrl = () => {
    const baseUrl = window.location.origin
    // Determine the correct identifier based on privacy settings
    const identifier = (!preferences.privacySettings.isPublic && preferences.privacySettings.customSlug)
      ? preferences.privacySettings.customSlug
      : (preferences.privacySettings.customSlug || session?.spotifyId)

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
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="display-lyrics">Synchronized Lyrics</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Show real-time synchronized lyrics on your display page
                      </p>
                    </div>
                    <Switch
                      id="display-lyrics"
                      checked={preferences.publicDisplaySettings.showLyrics}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          publicDisplaySettings: {
                            ...prev.publicDisplaySettings,
                            showLyrics: checked
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
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          placeholder={!preferences.privacySettings.isPublic ? "Required for private mode" : "Custom slug (optional)"}
                          value={preferences.privacySettings.customSlug || ''}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                            setPreferences(prev => ({
                              ...prev,
                              privacySettings: {
                                ...prev.privacySettings,
                                customSlug: value
                              }
                            }))
                            setSlugCheckResult('idle')

                            // Debounced slug check
                            if (value.length >= 3) {
                              setTimeout(() => {
                                if (preferences.privacySettings.customSlug === value) {
                                  checkSlugAvailability(value)
                                }
                              }, 500)
                            }
                          }}
                          className={`${
                            !preferences.privacySettings.isPublic && !preferences.privacySettings.customSlug
                              ? "border-red-300"
                              : slugCheckResult === 'taken'
                                ? "border-red-300"
                                : slugCheckResult === 'available'
                                  ? "border-green-300"
                                  : ""
                          }`}
                        />
                        {slugCheckResult !== 'idle' && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            {slugCheckResult === 'checking' && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                            {slugCheckResult === 'available' && <CheckCircle className="h-3 w-3 text-green-500" />}
                            {slugCheckResult === 'taken' && <XCircle className="h-3 w-3 text-red-500" />}
                            {slugCheckResult === 'invalid' && <XCircle className="h-3 w-3 text-red-500" />}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" onClick={generateCustomSlug}>
                        <Shuffle className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>

                    {/* Status messages */}
                    {slugCheckResult === 'checking' && (
                      <p className="text-xs text-muted-foreground">⏳ Checking availability...</p>
                    )}
                    {slugCheckResult === 'available' && preferences.privacySettings.customSlug && (
                      <p className="text-xs text-green-600">✅ "{preferences.privacySettings.customSlug}" is available!</p>
                    )}
                    {slugCheckResult === 'taken' && (
                      <p className="text-xs text-red-600">❌ This slug is already taken. Please try another one.</p>
                    )}
                    {slugCheckResult === 'invalid' && (
                      <p className="text-xs text-red-600">❌ Invalid format. Use only lowercase letters, numbers, and hyphens (3-30 characters).</p>
                    )}
                  </div>

                  {preferences.privacySettings.customSlug && slugCheckResult !== 'taken' && (
                    <div className="space-y-2">
                      <Badge variant={preferences.privacySettings.isPublic ? "secondary" : "destructive"} className="break-all">
                        {preferences.privacySettings.isPublic ? "Custom slug: " : "Private URL: "}
                        {preferences.privacySettings.customSlug}
                        {slugCheckResult === 'available' && " ✓"}
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
                  Your Links
                </CardTitle>
                <CardDescription>
                  Share these links with your audience or use them in OBS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Public Display Page</Label>
                    {preferences.privacySettings && !preferences.privacySettings.isPublic && (
                      <Badge variant="secondary" className="text-xs">
                        🔒 Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {preferences.privacySettings && !preferences.privacySettings.isPublic
                      ? "Your private display page - only people with this URL can access it"
                      : "Share this page with your audience to show what you're listening to"
                    }
                  </p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getDisplayUrl()}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getDisplayUrl(), 'Display Page URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Stream Overlay</Label>
                    {preferences.privacySettings && !preferences.privacySettings.isPublic && (
                      <Badge variant="secondary" className="text-xs">
                        🔒 Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {preferences.privacySettings && !preferences.privacySettings.isPublic
                      ? "Your private stream overlay for OBS - transparent background for overlays"
                      : "Add this URL as a Browser Source in OBS for transparent stream overlays"
                    }
                  </p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getStreamUrl()}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getStreamUrl(), 'Stream Overlay URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg border">
                  <h4 className="text-sm font-medium mb-2">💡 Quick Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>Display Page:</strong> Perfect for sharing on social media, Discord, or your website</li>
                    <li>• <strong>Stream Overlay:</strong> Add to OBS as Browser Source with transparent background</li>
                    {preferences.privacySettings && !preferences.privacySettings.isPublic && (
                      <li>• <strong>Private Mode:</strong> Only people with these exact URLs can access your music data</li>
                    )}
                  </ul>
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
                  Customize the appearance of your stream overlay for OBS and streaming software
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Theme Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Display Style</Label>
                    <Badge variant="secondary" className="text-xs">
                      {displayStyles.length} styles available
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Choose from {displayStyles.length} unique styles for your display</p>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {['all', 'minimal', 'modern', 'retro', 'neon', 'spotify', 'nature', 'gaming'].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {category !== 'all' && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {displayStyles.filter(s => s.category === category).length}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Style Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {filteredStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`group cursor-pointer p-3 rounded-lg border transition-all hover:scale-105 relative ${
                          preferences.displaySettings.style === style.id
                            ? 'ring-2 ring-primary border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
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
                              toast.success(`Style changed to ${style.name}`)
                            } else {
                              toast.error('Failed to save display style')
                            }
                          } catch (error) {
                            console.error('Error saving display style:', error)
                            toast.error('Failed to save display style')
                          }
                        }}
                      >
                        {/* Preview */}
                        <div
                          className="w-full h-12 rounded mb-2 border relative overflow-hidden"
                          style={{ background: style.preview }}
                        >
                          {/* Category badge */}
                          <Badge
                            variant="secondary"
                            className="absolute top-1 right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {style.category}
                          </Badge>

                          {/* Selected indicator */}
                          {preferences.displaySettings.style === style.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Style info */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium truncate">{style.name}</div>
                          <div className="text-xs text-muted-foreground truncate leading-tight">
                            {style.description}
                          </div>
                        </div>

                        {/* Hover preview */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="text-white text-xs text-center p-2">
                            <div className="font-medium">{style.name}</div>
                            <div className="text-xs opacity-80">{style.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredStyles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No styles found in this category</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Custom CSS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/docs/custom-css', '_blank')}
                      className="text-xs"
                    >
                      📖 View Docs
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add custom CSS to style your stream page. Use CSS selectors to customize colors, fonts, sizes, and more.
                  </p>
                  <textarea
                    id="custom-css"
                    placeholder={`/* 🎨 Neon Glow Theme - Working Example */
.track-title {
  color: #00ff88 !important;
  text-shadow: 0 0 20px #00ff88 !important;
  font-size: 2.5rem !important;
}

.stream-card {
  background: rgba(0, 0, 0, 0.9) !important;
  border: 2px solid #00ff88 !important;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.3) !important;
  border-radius: 12px !important;
}

/* � Show recent tracks (hidden by default) */
.recent-tracks {
  display: block !important;
  background: rgba(0, 0, 0, 0.7) !important;
  border-radius: 8px !important;
  padding: 0.5rem !important;
}

/* �🌸 Cute Pink Theme */
.track-artist {
  color: #ff6b9d !important;
  font-weight: 600 !important;
}

/* 💫 Hide unwanted elements */
.track-duration { display: none !important; }
.track-progress { display: none !important; }`}
                    className="w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-background font-mono resize-y"
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
                  <p className="text-xs text-amber-600">
                    ⚠️ Advanced feature: Invalid CSS may break your stream page. Test changes before saving.
                  </p>
                </div>

                <Separator />

                {/* Custom Background Image - ENABLED FOR DEVELOPMENT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="background-image">Background Image</Label>
                    {imageTestResult !== 'idle' && (
                      <div className="flex items-center gap-2">
                        {imageTestResult === 'testing' && <Loader2 className="h-3 w-3 animate-spin" />}
                        {imageTestResult === 'valid' && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {imageTestResult === 'invalid' && <XCircle className="h-3 w-3 text-red-500" />}
                        <span className="text-xs text-muted-foreground">
                          {imageTestResult === 'testing' && 'Testing...'}
                          {imageTestResult === 'valid' && 'Valid'}
                          {imageTestResult === 'invalid' && 'Invalid URL'}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add a custom background image to your display pages. Stream pages are always transparent for OBS overlays. Use a direct image URL (jpg, png, gif, etc.)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="background-image"
                      type="url"
                      placeholder="https://i.imgur.com/example.jpg"
                      value={preferences.displaySettings.backgroundImage || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setPreferences(prev => ({
                          ...prev,
                          displaySettings: {
                            ...prev.displaySettings,
                            backgroundImage: value
                          }
                        }))
                        setImageTestResult('idle')
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testBackgroundImage(preferences.displaySettings.backgroundImage || '')}
                      disabled={!preferences.displaySettings.backgroundImage || imageTestResult === 'testing'}
                    >
                      Test
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Supported:</strong> Imgur, Discord CDN, GitHub, Unsplash, and other direct image URLs</p>
                    <p><strong>Note:</strong> Background images only work on display pages. Stream pages remain transparent for OBS overlays.</p>
                  </div>
                </div>
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
