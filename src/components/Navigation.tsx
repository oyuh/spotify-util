'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, LogIn, LogOut, Music, Palette } from 'lucide-react'
import SettingsModal from '@/components/SettingsModal'
import AppThemeSelector from '@/components/AppThemeSelector'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [showNav, setShowNav] = useState(true)
  const [isHoveringTop, setIsHoveringTop] = useState(false)
  const pathname = usePathname()

  // Check if we're on a display page
  const isDisplayPage = pathname?.startsWith('/display/')

  // Auto-hide navigation after 10 seconds, but show on hover
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNav(false)
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  // Handle hover with delay for hiding
  useEffect(() => {
    let hideTimer: NodeJS.Timeout

    if (!isHoveringTop) {
      // Start 5-second timer when cursor leaves hover area
      hideTimer = setTimeout(() => {
        setShowNav(false)
      }, 5000)
    } else {
      // Show immediately when hovering
      setShowNav(true)
    }

    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    }
  }, [isHoveringTop])

  if (status === 'loading') {
    return (
      <>
        {/* Hover detection area for navigation */}
        <div
          className="fixed top-0 left-0 w-full h-20 z-40"
          onMouseEnter={() => setIsHoveringTop(true)}
          onMouseLeave={() => setIsHoveringTop(false)}
        />

        <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md border rounded-2xl shadow-xl shadow-black/10 transition-all duration-500 ease-out ${
          showNav || isHoveringTop ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
        } ${isDisplayPage
          ? 'bg-black/95 border-gray-700/50'
          : 'bg-background/95 border-border/50'
        }`}>
          <div className="px-4 flex h-14 items-center">
            <div className="mr-4 flex">
              <Music className="mr-2 h-5 w-5 text-primary" />
              <span className="font-bold">SpotifyUtil</span>
            </div>
            <div className="w-20 h-8 bg-muted/50 animate-pulse rounded ml-6" />
          </div>
        </nav>
      </>
    )
  }

  return (
    <>
      {/* Hover detection area for navigation */}
      <div
        className="fixed top-0 left-0 w-full h-20 z-40"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      />

      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md border rounded-2xl shadow-xl shadow-black/10 transition-all duration-500 ease-out ${
        showNav || isHoveringTop ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${isDisplayPage
        ? 'bg-black/95 border-gray-700/50'
        : 'bg-background/95 border-border/50'
      }`}>
      <div className="px-4 flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="mr-2 h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Music className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDisplayPage
                ? 'from-white to-gray-300'
                : 'from-foreground to-foreground/80'
            }`}>SpotifyUtil</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 ml-6">
          {session ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className={`font-medium transition-colors ${
                  isDisplayPage
                    ? 'text-white hover:bg-gray-800'
                    : 'hover:bg-accent'
                }`}>
                  Dashboard
                </Button>
              </Link>

              <Link href="/leaderboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className={`font-medium transition-colors ${
                  isDisplayPage
                    ? 'text-white hover:bg-gray-800'
                    : 'hover:bg-accent'
                }`}>
                  Leaderboard
                </Button>
              </Link>

              <AppThemeSelector>
                <Button variant="ghost" size="sm" className={`transition-colors ${
                  isDisplayPage
                    ? 'text-white hover:bg-gray-800'
                    : 'hover:bg-accent'
                }`}>
                  <Palette className={`h-4 w-4 sm:mr-2 ${
                    isDisplayPage ? 'text-green-400' : 'text-primary'
                  }`} />
                  <span className="hidden sm:inline">Themes</span>
                </Button>
              </AppThemeSelector>

              <SettingsModal>
                <Button variant="ghost" size="sm" className={`transition-colors ${
                  isDisplayPage
                    ? 'text-white hover:bg-gray-800'
                    : 'hover:bg-accent'
                }`}>
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </SettingsModal>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className={`font-medium transition-colors ${
                  isDisplayPage
                    ? 'border-gray-700 text-white hover:bg-gray-800'
                    : 'border-border hover:bg-accent'
                }`}
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
    </>
  )
}
