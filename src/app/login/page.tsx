"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Headphones, Radio, Zap } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                <Music className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome to SpotifyUtil</CardTitle>
              <CardDescription className="text-base mt-2">
                Connect your Spotify account to start sharing your music
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-1 bg-green-500/10 rounded">
                  <Headphones className="h-4 w-4 text-green-600" />
                </div>
                <span>Share your currently playing track</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-1 bg-blue-500/10 rounded">
                  <Radio className="h-4 w-4 text-blue-600" />
                </div>
                <span>Display your recent listening history</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-1 bg-purple-500/10 rounded">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <span>Customize with your own CSS styling</span>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              size="lg"
            >
              <Music className="mr-2 h-5 w-5" />
              Continue with Spotify
            </Button>            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center">
              We only access your currently playing track and recent listening history.
              Your data is secure and private.
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
