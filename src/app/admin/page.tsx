'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, Shield, Database, Trash2, Lock, Unlock, RefreshCw, Search, Settings, BarChart3, AlertCircle, CheckCircle, XCircle, Play, Link2, Image } from 'lucide-react'

// Duplicate Manager Component
function DuplicateManager() {
  const [duplicates, setDuplicates] = useState<any>(null)
  const [maintenanceResults, setMaintenanceResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const analyzeDuplicates = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/user/analyze-duplicates')
      const data = await response.json()
      if (data.success) {
        setDuplicates(data)
      } else {
        setError(data.error || 'Failed to analyze duplicates')
      }
    } catch (err) {
      setError('Network error analyzing duplicates')
    } finally {
      setLoading(false)
    }
  }

  const runMaintenance = async (taskName?: string) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskName ? { taskName } : {})
      })
      const data = await response.json()
      if (data.success) {
        setMaintenanceResults(data.results)
        setSuccess(`Maintenance completed successfully!`)
      } else {
        setError(data.error || 'Failed to run maintenance')
      }
    } catch (err) {
      setError('Network error running maintenance')
    } finally {
      setLoading(false)
    }
  }

  const deleteDuplicate = async (preferenceId: string) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/user/analyze-duplicates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferenceIdToDelete: preferenceId })
      })
      const data = await response.json()
      if (data.success) {
        setSuccess(`Successfully deleted duplicate preference`)
        analyzeDuplicates() // Refresh the analysis
      } else {
        setError(data.error || 'Failed to delete duplicate')
      }
    } catch (err) {
      setError('Network error deleting duplicate')
    } finally {
      setLoading(false)
    }
  }

  const autoFixDuplicates = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/user/fix-my-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.success) {
        setSuccess(`Auto-fix completed! ${data.message}`)
        analyzeDuplicates() // Refresh the analysis
      } else {
        setError(data.error || 'Failed to auto-fix duplicates')
      }
    } catch (err) {
      setError('Network error during auto-fix')
    } finally {
      setLoading(false)
    }
  }

  const cleanupAllDuplicates = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin/cleanup-all-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.success) {
        setSuccess(`System-wide cleanup completed! Found ${data.results.duplicatesFound} duplicate groups, removed ${data.results.duplicatesRemoved} records`)
        analyzeDuplicates() // Refresh the analysis
      } else {
        setError(data.error || 'Failed to cleanup all duplicates')
      }
    } catch (err) {
      setError('Network error during cleanup')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    analyzeDuplicates()
  }, [])

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Account Analysis</CardTitle>
          <CardDescription>Check for duplicate user preferences in your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={analyzeDuplicates} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze My Account
            </Button>
            {duplicates && duplicates.duplicateCount > 1 && (
              <Button onClick={autoFixDuplicates} disabled={loading} variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Auto-Fix My Duplicates
              </Button>
            )}
          </div>

          {duplicates && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Session</Label>
                  <div className="text-sm bg-muted p-2 rounded mt-1">
                    <div>User ID: {duplicates.currentSession.userId}</div>
                    <div>Spotify ID: {duplicates.currentSession.spotifyId}</div>
                  </div>
                </div>
                <div>
                  <Label>Account Info</Label>
                  <div className="text-sm bg-muted p-2 rounded mt-1">
                    {duplicates.account ? (
                      <>
                        <div>Provider: {duplicates.account.provider}</div>
                        <div>Account ID: {duplicates.account.providerAccountId}</div>
                      </>
                    ) : (
                      <div>No account found</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label>User Preferences Found: {duplicates.duplicateCount}</Label>
                {duplicates.duplicateCount > 1 && (
                  <Badge variant="destructive" className="ml-2">Duplicates Detected!</Badge>
                )}
              </div>

              {duplicates.userPreferences.map((pref: any, index: number) => (
                <Card key={pref._id} className={`${pref.isCurrentUser ? 'border-green-500/50 bg-green-500/10' : 'border-border'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm">Preference #{index + 1}</CardTitle>
                        <CardDescription>ID: {pref._id}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {pref.isCurrentUser && <Badge variant="default">Current User</Badge>}
                        {pref.hasValidUserId && <Badge variant="outline">Valid User ID</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>User ID</Label>
                        <div className="font-mono">{pref.userId}</div>
                      </div>
                      <div>
                        <Label>Spotify ID</Label>
                        <div className="font-mono">{pref.spotifyId}</div>
                      </div>
                      <div>
                        <Label>Created</Label>
                        <div>{new Date(pref.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <Label>Updated</Label>
                        <div>{new Date(pref.updatedAt).toLocaleString()}</div>
                      </div>
                      {pref.slug && (
                        <div>
                          <Label>Custom Slug</Label>
                          <div>{pref.slug}</div>
                        </div>
                      )}
                    </div>

                    {!pref.isCurrentUser && duplicates.duplicateCount > 1 && (
                      <div className="mt-4 pt-4 border-t">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete This Duplicate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Duplicate Preference</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this user preference record. Make sure you're keeping the correct one!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDuplicate(pref._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Duplicate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {duplicates.recommendation && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommendation:</strong> {duplicates.recommendation.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System-wide Duplicate Cleanup</CardTitle>
          <CardDescription>Clean up duplicates for all users in the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={cleanupAllDuplicates} disabled={loading} variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            Clean Up All User Duplicates
          </Button>
          <div className="text-sm text-muted-foreground">
            <p><strong>Warning:</strong> This will find and remove duplicate user preferences for ALL users system-wide.</p>
            <p>It will keep the oldest record or the one with a valid userId, and preserve custom slugs.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System-wide Maintenance</CardTitle>
          <CardDescription>Run maintenance tasks to clean up the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => runMaintenance('cleanup-duplicates')} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Fix Duplicates
            </Button>
            <Button onClick={() => runMaintenance('validate-linking')} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Validate Linking
            </Button>
            <Button onClick={() => runMaintenance('fix-malformed-userids')} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Fix Malformed IDs
            </Button>
            <Button onClick={() => runMaintenance()} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Run All Tasks
            </Button>
          </div>

          {maintenanceResults && (
            <div className="mt-4">
              <Label>Last Maintenance Results</Label>
              <Textarea
                value={JSON.stringify(maintenanceResults, null, 2)}
                readOnly
                className="h-40 text-xs font-mono"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface User {
  id: string
  name: string
  email: string
  isActive: boolean
  isLocked: boolean
  createdAt: string
  spotifyId?: string
  accountProvider?: string
  hasPreferences: boolean
}

interface SystemStats {
  users: {
    total: number
    active: number
    locked: number
    withAccounts: number
    withPreferences: number
  }
  privacy: {
    public: number
    private: number
  }
  customization: {
    customSlugs: number
    backgroundImages: number
  }
  recent: User[]
}

interface UserPreferences {
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    isLocked: boolean
  }
  preferences: any
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [customSlugs, setCustomSlugs] = useState<any[]>([])
  const [backgroundImages, setBackgroundImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserPreferences | null>(null)
  const [editingUser, setEditingUser] = useState(false)

  // Check if we're in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setError('Admin panel is only available in development')
      return
    }
    loadStats()
    loadUsers()
    loadCustomSlugs()
    loadBackgroundImages()
  }, [])

  const loadCustomSlugs = async () => {
    try {
      const response = await fetch('/api/dev/admin/system?action=custom-slugs')
      const data = await response.json()
      if (data.success) {
        setCustomSlugs(data.data)
      }
    } catch (err) {
      console.error('Failed to load custom slugs:', err)
    }
  }

  const loadBackgroundImages = async () => {
    try {
      const response = await fetch('/api/dev/admin/system?action=background-images')
      const data = await response.json()
      if (data.success) {
        setBackgroundImages(data.data)
      }
    } catch (err) {
      console.error('Failed to load background images:', err)
    }
  }

  const loadUsers = async (page = 1, search = '') => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (search) params.append('search', search)

      const response = await fetch(`/api/dev/admin/users/list?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data.users)
        setCurrentPage(data.data.pagination.currentPage)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        setError(data.error || 'Failed to load users')
      }
    } catch (err) {
      setError('Network error loading users')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/dev/admin/system?action=stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadUsers(1, searchTerm)
  }

  const handleDeleteUser = async (userId: string) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/dev/admin/users/delete?userId=${userId}&confirm=DELETE_USER_CONFIRMED`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setSuccess(`User deleted successfully. Removed: ${JSON.stringify(data.deletedCounts)}`)
        loadUsers(currentPage, searchTerm)
        loadStats()
      } else {
        setError(data.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('Network error deleting user')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'lock' | 'unlock' | 'reset-preferences') => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/dev/admin/users/manage?userId=${userId}&action=${action}`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        loadUsers(currentPage, searchTerm)
        loadStats()
        if (selectedUser && selectedUser.user.id === userId) {
          loadUserDetails(userId)
        }
      } else {
        setError(data.error || `Failed to ${action} user`)
      }
    } catch (err) {
      setError(`Network error during ${action}`)
    } finally {
      setLoading(false)
    }
  }

  const loadUserDetails = async (userId: string) => {
    if (!userId || userId === 'undefined') {
      setError('Invalid user ID')
      return
    }

    try {
      const response = await fetch(`/api/dev/admin/users/manage?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedUser(data.data)
      } else {
        setError(data.error || 'Failed to load user details')
      }
    } catch (err) {
      setError('Network error loading user details')
    }
  }

  const handleSystemMaintenance = async (action: 'cleanup-orphaned' | 'reset-all-preferences') => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const body = action === 'reset-all-preferences'
        ? { confirm: 'RESET_ALL_PREFERENCES' }
        : {}

      const response = await fetch(`/api/dev/admin/system?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await response.json()

      if (data.success) {
        setSuccess(data.message + (data.results ? ` Results: ${JSON.stringify(data.results)}` : ''))
        loadStats()
        loadUsers(currentPage, searchTerm)
      } else {
        setError(data.error || `Failed to ${action}`)
      }
    } catch (err) {
      setError(`Network error during ${action}`)
    } finally {
      setLoading(false)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin panel is only available in development environment.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Development environment user management</p>
        </div>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Development Only
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Duplicates
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="custom-slugs" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Custom Slugs
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Backgrounds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.users.active} active, {stats.users.locked} locked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Privacy Settings</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.privacy.public}</div>
                  <p className="text-xs text-muted-foreground">
                    Public profiles ({stats.privacy.private} private)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Custom Slugs</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.customization.customSlugs}</div>
                  <p className="text-xs text-muted-foreground">
                    Users with custom URLs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Background Images</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.customization.backgroundImages}</div>
                  <p className="text-xs text-muted-foreground">
                    Display customizations
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {stats?.recent && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Last 5 registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recent.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="flex gap-2">
                        {user.isActive ? (
                          <Badge key="active-badge" variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge key="inactive-badge" variant="secondary">Inactive</Badge>
                        )}
                        {user.isLocked && (
                          <Badge key="locked-badge" variant="destructive">Locked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Search</CardTitle>
              <CardDescription>Search and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>Page {currentPage} of {totalPages}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                        {user.spotifyId && ` • Spotify: ${user.spotifyId}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <Badge key="active-badge" variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge key="inactive-badge" variant="secondary">Inactive</Badge>
                      )}
                      {user.isLocked && (
                        <Badge key="locked-badge" variant="destructive">Locked</Badge>
                      )}
                      {user.hasPreferences && (
                        <Badge key="prefs-badge" variant="outline">Has Prefs</Badge>
                      )}

                      <div className="flex gap-1">
                        <Dialog key="manage-dialog">
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log('Loading user details for:', user.id, user)
                                loadUserDetails(user.id)
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Manage User: {user.name}</DialogTitle>
                              <DialogDescription>
                                Update user settings and preferences
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Status</Label>
                                    <div className="flex gap-2 mt-1">
                                      <Button
                                        variant={selectedUser.user.isLocked ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => handleUserAction(user.id, selectedUser.user.isLocked ? 'unlock' : 'lock')}
                                      >
                                        {selectedUser.user.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                        {selectedUser.user.isLocked ? 'Unlock' : 'Lock'}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUserAction(user.id, 'reset-preferences')}
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                        Reset Prefs
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                {selectedUser.preferences && (
                                  <div>
                                    <Label>Preferences (Read-only)</Label>
                                    <Textarea
                                      value={JSON.stringify(selectedUser.preferences, null, 2)}
                                      readOnly
                                      className="h-40 text-xs font-mono"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {user.isLocked ? (
                          <Button
                            key="unlock-btn"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'unlock')}
                          >
                            <Unlock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            key="lock-btn"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'lock')}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        )}

                        <AlertDialog key="delete-dialog">
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {user.name} and all their data (accounts, preferences, sessions). This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = currentPage - 1
                      setCurrentPage(newPage)
                      loadUsers(newPage, searchTerm)
                    }}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const newPage = currentPage + 1
                      setCurrentPage(newPage)
                      loadUsers(newPage, searchTerm)
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-4">
          <DuplicateManager />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Dangerous operations - use with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSystemMaintenance('cleanup-orphaned')}
                  disabled={loading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Clean Orphaned Data
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Preferences
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset All User Preferences</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset ALL user preferences to default values. This action affects every user in the system and cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSystemMaintenance('reset-all-preferences')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reset All Preferences
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Clean Orphaned Data:</strong> Removes accounts, preferences, and sessions that don't have corresponding users.</p>
                <p><strong>Reset All Preferences:</strong> Resets every user's preferences to default values.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  loadStats()
                  loadUsers(currentPage, searchTerm)
                }}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-slugs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Slugs ({customSlugs.length})</CardTitle>
              <CardDescription>Users with custom profile URLs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customSlugs.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium text-lg">{item.slug}</div>
                      <div className="text-sm text-muted-foreground">
                        User: {item.userName} ({item.userEmail})
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {customSlugs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No custom slugs found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backgrounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Background Images ({backgroundImages.length})</CardTitle>
              <CardDescription>Users with custom background images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backgroundImages.map((item, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.backgroundImage} 
                        alt={`Background for ${item.userName}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="font-medium truncate">{item.userName}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.userEmail}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                      <a 
                        href={item.backgroundImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-2 block"
                      >
                        View Full Image
                      </a>
                    </CardContent>
                  </Card>
                ))}
                {backgroundImages.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No background images found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
