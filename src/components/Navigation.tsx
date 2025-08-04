'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Settings, LogIn, LogOut, Music, Palette } from 'lucide-react'
import SettingsModal from '@/components/SettingsModal'
import AppThemeSelector from '@/components/AppThemeSelector'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-black/10">
        <div className="px-4 flex h-14 items-center">
          <div className="mr-4 flex">
            <Music className="mr-2 h-5 w-5 text-primary" />
            <span className="font-bold">SpotifyUtil</span>
          </div>
          <div className="w-20 h-8 bg-muted/50 animate-pulse rounded ml-6" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl shadow-black/10">
      <div className="px-4 flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="mr-2 h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Music className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">SpotifyUtil</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 ml-6">
          {session ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-medium hover:bg-accent transition-colors">
                  Dashboard
                </Button>
              </Link>

              <AppThemeSelector>
                <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
                  <Palette className="h-4 w-4 sm:mr-2 text-primary" />
                  <span className="hidden sm:inline">Themes</span>
                </Button>
              </AppThemeSelector>

              <SettingsModal>
                <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </SettingsModal>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="font-medium border-border hover:bg-accent transition-colors"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn('spotify')}
              className="font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in with Spotify
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
