'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Copy, Check, Monitor, Settings, Eye, Music, User, Trash2, AlertTriangle, Radio, Code, Tv } from 'lucide-react'
import { CurrentTrack } from '@/components/CurrentTrack'
import { RecentTracks } from '@/components/RecentTracks'
import SettingsModal from '@/components/SettingsModal'
import { getBaseUrl } from '@/lib/url'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface UserProfile {
  id: string
  display_name: string
  email: string
  images: Array<{ url: string }>
  followers: { total: number }
  country: string
  product: string
}

interface UserPreferences {
  privacySettings: {
    isPublic: boolean
    customSlug?: string
  }
  publicDisplaySettings: {
    showArtist: boolean
    showAlbum: boolean
    showDuration: boolean
    showProgress: boolean
    showCredits: boolean
  }
  displaySettings: {
    style: string
    customCSS?: string
    backgroundImage?: string
    position?: { x: number; y: number }
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [commitInfo, setCommitInfo] = useState<{
    hash: string
    date: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.accessToken) {
      fetchUserProfile()
      fetchUserPreferences()
    }

    // Fetch commit info regardless of auth status
    fetchCommitInfo()
  }, [status, session, router])

  const fetchCommitInfo = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/oyuh/spotify-util/commits?per_page=1')
      if (response.ok) {
        const [latestCommit] = await response.json()
        setCommitInfo({
          hash: latestCommit.sha.substring(0, 7), // Short hash
          date: new Date(latestCommit.commit.committer.date).toLocaleString(),
          message: latestCommit.commit.message
        })
      }
    } catch (error) {
      console.error('Failed to fetch commit info:', error)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences')

      if (!response.ok) {
        throw new Error('Failed to fetch user preferences')
      }

      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error('Error fetching user preferences:', error)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedUrl(type)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const deleteAccountData = async () => {
    if (!session?.userId) return

    setIsDeletingAccount(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account data')
      }

      // Sign out after successful deletion
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Error deleting account data:', error)
      alert('Failed to delete account data. Please try again.')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spotify-green mx-auto"></div>
          <p className="text-white mt-4">Loading your Spotify data...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const baseUrl = getBaseUrl()

  // Debug logging
  console.log('Dashboard debug - session:', session)
  console.log('Dashboard debug - profile:', profile)
  console.log('Dashboard debug - preferences:', preferences)
  console.log('Dashboard debug - spotifyId:', session?.spotifyId)
  console.log('Dashboard debug - profile id:', profile?.id)

  // Determine the correct identifier based on privacy settings
  const getDisplayIdentifier = () => {
    // If privacy mode is enabled and custom slug exists, use the custom slug
    if (preferences?.privacySettings && !preferences.privacySettings.isPublic && preferences.privacySettings.customSlug) {
      return preferences.privacySettings.customSlug
    }
    // Otherwise use the default Spotify ID
    return session?.spotifyId || profile?.id || 'demo'
  }

  const displayIdentifier = getDisplayIdentifier()
  const publicDisplayUrl = `${baseUrl}/display/${displayIdentifier}`
  const streamingUrl = `${baseUrl}/stream/${displayIdentifier}`

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your Spotify display settings and view your music activity</p>
          </div>
          {commitInfo && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Latest: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{commitInfo.hash}</code>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {commitInfo.date}
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="music" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="music">🎵 Music</TabsTrigger>
              <TabsTrigger value="streaming">🎥 Streaming</TabsTrigger>
              <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            {/* Quick Links Section */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <span>Public Display</span>
                    {preferences?.privacySettings && !preferences.privacySettings.isPublic && (
                      <Badge variant="secondary" className="text-xs">
                        🔒 Private
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {preferences?.privacySettings && !preferences.privacySettings.isPublic
                      ? "Your private custom link - only people with this URL can access it"
                      : "Share your music with anyone"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                    {publicDisplayUrl}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(publicDisplayUrl, 'public')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {copiedUrl === 'public' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedUrl === 'public' ? 'Copied!' : 'Copy'}</span>
                    </Button>
                    <Button
                      onClick={() => window.open(publicDisplayUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    <span>Streaming Overlay</span>
                    {preferences?.privacySettings && !preferences.privacySettings.isPublic && (
                      <Badge variant="secondary" className="text-xs">
                        🔒 Private
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {preferences?.privacySettings && !preferences.privacySettings.isPublic
                      ? "Private overlay for OBS and streaming software"
                      : "For OBS and streaming software"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                    {streamingUrl}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(streamingUrl, 'streaming')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {copiedUrl === 'streaming' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedUrl === 'streaming' ? 'Copied!' : 'Copy'}</span>
                    </Button>
                    <Button
                      onClick={() => window.open(streamingUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Music Content */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Playing</CardTitle>
                  <CardDescription>Your current track updates automatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <CurrentTrack />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Tracks</CardTitle>
                  <CardDescription>Your recently played songs</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-muted-foreground">
                    <RecentTracks showHeader={false} limit={50} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Streaming Tab */}
          <TabsContent value="streaming" className="space-y-6">
            {/* Stream Setup Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="h-5 w-5 text-primary" />
                  <span>Stream Setup Guide</span>
                </CardTitle>
                <CardDescription>
                  Get your music overlay running on Twitch, YouTube, or any streaming platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stream URL */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>Your Stream Overlay URL</span>
                  </h4>
                  <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                    {streamingUrl}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(streamingUrl, 'streaming')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {copiedUrl === 'streaming' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedUrl === 'streaming' ? 'Copied!' : 'Copy URL'}</span>
                    </Button>
                    <Button
                      onClick={() => window.open(streamingUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Test Overlay</span>
                    </Button>
                  </div>
                </div>

                {/* OBS Setup Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Tv className="h-4 w-4" />
                    <span>OBS Studio Setup</span>
                  </h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>In OBS, click the <strong>+</strong> in Sources</li>
                      <li>Add <strong>Browser Source</strong></li>
                      <li>Name it "Music Overlay" and click OK</li>
                      <li>Set URL to your stream overlay URL above</li>
                      <li>Set Width: <strong>400</strong>, Height: <strong>200</strong></li>
                      <li>Check ✅ <strong>"Shutdown source when not visible"</strong></li>
                      <li>Check ✅ <strong>"Refresh browser when scene becomes active"</strong></li>
                      <li>Click OK and position the overlay on your stream</li>
                      <li>Hint: If you hold alt+drag, you can crop the overlay</li>
                    </ol>
                  </div>
                </div>

                {/* Other Streaming Software */}
                <div className="space-y-3">
                  <h4 className="font-medium">Other Streaming Software</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <h5 className="font-medium mb-1">Streamlabs OBS</h5>
                      <p className="text-muted-foreground">Add Widget → Custom → Browser Source</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <h5 className="font-medium mb-1">XSplit</h5>
                      <p className="text-muted-foreground">Add Source → Web Page → Enter URL</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Customization */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-primary" />
                    <span>Custom CSS Examples</span>
                  </CardTitle>
                  <CardDescription>
                    Copy and paste these styles to customize your stream overlay
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {/* Glow Effect */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">🌟 Glowing Border Effect</h5>
                      <div className="bg-gray-900 p-3 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
                        <pre>{`.stream-card {
  border: 2px solid #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
  to { box-shadow: 0 0 30px rgba(16, 185, 129, 0.8); }
}`}</pre>
                      </div>
                    </div>

                    {/* Neon Theme */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">💜 Cyberpunk Neon Style</h5>
                      <div className="bg-gray-900 p-3 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
                        <pre>{`.stream-container {
  background: linear-gradient(45deg, #1a0033, #330066);
  border: 1px solid #ff00ff;
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
}

.track-title {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.track-artist {
  color: #ff00ff;
}`}</pre>
                      </div>
                    </div>

                    {/* Gaming Theme */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">🎮 Gaming Theme</h5>
                      <div className="bg-gray-900 p-3 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
                        <pre>{`.stream-container {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #00ff41;
  border-radius: 0;
  font-family: 'Courier New', monospace;
}

.track-title {
  color: #00ff41;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Show recent tracks (hidden by default) */
.recent-tracks {
  display: block !important;
}

.album-art {
  filter: hue-rotate(120deg) saturate(1.5);
}`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Tip:</strong> Go to Settings → Display & Privacy Settings → Custom CSS to apply these styles
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Stream Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your overlay appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Customize your stream overlay with custom css in the style tab, positioning, and privacy settings.
                  </p>

                  <SettingsModal isFullVersion={true}>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Open Stream Settings
                    </Button>
                  </SettingsModal>
                </CardContent>
              </Card>
            </div>

            {/* Public Display Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>Public Display</span>
                  {preferences?.privacySettings && !preferences.privacySettings.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      🔒 Private
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {preferences?.privacySettings && !preferences.privacySettings.isPublic
                    ? "Your private custom link - share only with trusted viewers"
                    : "Share your music with viewers via this public page"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                  {publicDisplayUrl}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => copyToClipboard(publicDisplayUrl, 'public')}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {copiedUrl === 'public' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copiedUrl === 'public' ? 'Copied!' : 'Copy'}</span>
                  </Button>
                  <Button
                    onClick={() => window.open(publicDisplayUrl, '_blank')}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Page</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 {preferences?.privacySettings && !preferences.privacySettings.isPublic
                    ? "This is your private link - only share with trusted viewers"
                    : "Share this link in your stream description, Discord, or social media"
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Your Spotify account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={profile.images?.[0]?.url} alt={profile.display_name} />
                          <AvatarFallback>
                            <User className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium">{profile.display_name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{profile.country}</span>
                            <Badge variant={profile.product === 'premium' ? 'default' : 'secondary'}>
                              {profile.product === 'premium' ? 'Premium' : 'Free'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Account Information</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Spotify ID:</span>
                            <span className="font-mono">{profile.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Followers:</span>
                            <span>{profile.followers?.total || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Session ID:</span>
                            <span className="font-mono">{session?.spotifyId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Display & Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Display & Privacy Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how your music data is displayed and shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Customize what information is shown in your public displays, create custom private links,
                    and configure streaming overlays for OBS.
                  </p>

                  <SettingsModal isFullVersion={true}>
                    <Button className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Open Full Settings
                    </Button>
                  </SettingsModal>

                  <div className="text-xs text-muted-foreground">
                    <p>Settings include:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Display options (track info, progress, etc.)</li>
                      <li>Privacy settings and custom URLs</li>
                      <li>Public display links</li>
                      <li>Custom CSS for advanced styling</li>
                      <li>Streaming mode for OBS</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Actions that cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Sign Out</h5>
                      <p className="text-sm text-muted-foreground">
                        This will sign you out and revoke access tokens
                      </p>
                    </div>
                    <Button
                      onClick={() => signOut()}
                      variant="destructive"
                      size="sm"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-destructive/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h5 className="font-medium text-destructive">Delete Account Data</h5>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete all your account data, preferences, and custom slugs.
                          This will sign you out and cannot be undone.
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeletingAccount}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeletingAccount ? 'Deleting...' : 'Delete Data'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            data including:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Display preferences and settings</li>
                              <li>Custom slugs and privacy settings</li>
                              <li>Stored Spotify authentication tokens</li>
                              <li>All session data</li>
                            </ul>
                            <br />
                            You will be signed out immediately and will need to reconnect your
                            Spotify account to use the service again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deleteAccountData}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, delete my data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Links */}
        <div className="mt-12 pb-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="/privacy"
              className="hover:text-green-500 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="/terms"
              className="hover:text-green-500 transition-colors"
            >
              Terms of Service
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="/support"
              className="hover:text-green-500 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
