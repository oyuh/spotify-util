"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Home, ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

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

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,100,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                404
              </span>
            </CardTitle>
            <CardDescription className="text-xl text-gray-300">
              Oops! The page you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="text-gray-400 mb-8 leading-relaxed">
              Don't worry, it happens to the best of us. The page might have been moved,
              deleted, or you might have typed the wrong URL.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={handleGoHome}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleGoBack}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">
                Redirecting to home page in:
              </p>
              <div className="text-2xl font-bold text-green-400">
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
    </div>
  )
}
