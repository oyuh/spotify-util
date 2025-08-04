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
import { ExternalLink, Copy, Check, Monitor, Settings, Eye, Music, User, Trash2, AlertTriangle } from 'lucide-react'
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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.accessToken) {
      fetchUserProfile()
    }
  }, [status, session, router])

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
  console.log('Dashboard debug - spotifyId:', session?.spotifyId)
  console.log('Dashboard debug - profile id:', profile?.id)

  const publicDisplayUrl = `${baseUrl}/display/${session?.spotifyId || profile?.id || 'demo'}`
  const streamingUrl = `${baseUrl}/stream/${session?.spotifyId || profile?.id || 'demo'}`

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your Spotify display settings and view your music activity</p>
        </div>

        <Tabs defaultValue="music" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="music">🎵 Music</TabsTrigger>
              <TabsTrigger value="displays">🔗 Display Links</TabsTrigger>
              <TabsTrigger value="streaming">📺 Streaming</TabsTrigger>
              <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
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
                  <CardDescription>Your last 20 played songs</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTracks />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Display Links Tab */}
          <TabsContent value="displays" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <span>Public Display</span>
                  </CardTitle>
                  <CardDescription>
                    Share your music with anyone via this public link
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  </CardTitle>
                  <CardDescription>
                    Transparent overlay perfect for OBS and other streaming software
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">OBS Setup:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Add Browser Source</li>
                      <li>Set URL to the streaming URL above</li>
                      <li>Set Width: 400, Height: 200</li>
                      <li>Check "Shutdown source when not visible"</li>
                      <li>Check "Refresh browser when scene becomes active"</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Streaming Tab */}
          <TabsContent value="streaming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Streaming Integration</CardTitle>
                <CardDescription>
                  Tools and settings for content creators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">For OBS Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the streaming overlay URL in a Browser Source for seamless integration
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">For Streamlabs</h4>
                    <p className="text-sm text-muted-foreground">
                      Add as a Custom Widget using the streaming URL
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Customization Options</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Transparent Mode</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Perfect for overlays on top of your content
                      </p>
                      <Badge variant="outline">Default</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Auto-Refresh</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Updates every 5 seconds automatically
                      </p>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </div>
                </div>
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
