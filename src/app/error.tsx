"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Home, RefreshCw, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error)
  }, [error])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoHome = () => {
    router.push("/")
  }

  const handleTryAgain = () => {
    reset()
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-red-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,150,100,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Something went wrong
              </span>
            </CardTitle>
            <CardDescription className="text-xl text-gray-300">
              We encountered an unexpected error.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="text-gray-400 mb-6 leading-relaxed">
              Don't worry! This is usually temporary. Please try refreshing the page
              or go back to the home page.
            </p>

            {error.message && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-red-400 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Button
                size="lg"
                onClick={handleGoHome}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">
                Redirecting to home page in:
              </p>
              <div className="text-2xl font-bold text-orange-400">
                {countdown} second{countdown !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-500">
              <Music className="w-5 h-5 mr-2" />
              <span>SpotifyUtil</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
