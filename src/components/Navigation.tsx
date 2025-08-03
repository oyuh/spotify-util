'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Settings, LogIn, LogOut, Music } from 'lucide-react'
import SettingsModal from '@/components/SettingsModal'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-6 flex h-16 items-center max-w-none">
          <div className="mr-4 flex">
            <Music className="mr-2 h-6 w-6" />
            <span className="font-bold">SpotifyUtil</span>
          </div>
          <div className="flex-1" />
          <div className="w-20 h-9 bg-muted animate-pulse rounded" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="w-full px-6 flex h-16 items-center max-w-none">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="mr-2 h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">SpotifyUtil</span>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-medium hover:bg-accent/50 transition-colors">
                  Dashboard
                </Button>
              </Link>

              <SettingsModal>
                <Button variant="ghost" size="sm" className="hover:bg-accent/50 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </SettingsModal>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="font-medium border-border/50 hover:bg-accent/50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn('spotify')}
              className="font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
