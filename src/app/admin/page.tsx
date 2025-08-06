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
import { Users, Shield, Database, Trash2, Lock, Unlock, RefreshCw, Search, Settings, BarChart3, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

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
  }, [])

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
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
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
      </Tabs>
    </div>
  )
}
