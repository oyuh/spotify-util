"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Home, RefreshCw, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(20)

  useEffect(() => {
    // Log the error for debugging
    console.error('Global application error:', error)
  }, [error])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <html>
      <body className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,100,255,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-red-500 animate-pulse">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                  Critical Error
                </span>
              </CardTitle>
              <CardDescription className="text-xl text-gray-300">
                The application encountered a critical error.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <p className="text-gray-400 mb-6 leading-relaxed">
                We're sorry, but something went seriously wrong. Please reload the page
                or return to the home page. If this keeps happening, please contact support.
              </p>

              {error.message && (
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 mb-6">
                  <p className="text-purple-300 text-sm font-mono">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-purple-400 text-xs mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  onClick={handleReload}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
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
                  Auto-redirecting to home page in:
                </p>
                <div className="text-2xl font-bold text-purple-400">
                  {countdown} second{countdown !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center justify-center text-gray-500">
                <Music className="w-5 h-5 mr-2" />
                <span>JamLog</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
