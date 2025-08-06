"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react"
import Link from "next/link"

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400">
              <strong className="text-green-400">Last updated:</strong> August 4, 2025
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Eye className="w-5 h-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  When you use SpotifyUtil, we collect minimal information necessary to provide our service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your Spotify account information (display name, profile picture)</li>
                  <li>Currently playing track information</li>
                  <li>Recently played tracks (when accessed)</li>
                  <li>Custom display preferences and themes</li>
                  <li>Custom background images you upload</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Database className="w-5 h-5" />
                  How We Use Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Your data is used exclusively to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Display your current and recent music activity</li>
                  <li>Save your theme and display preferences</li>
                  <li>Provide custom background image functionality</li>
                  <li>Generate privacy-focused display URLs</li>
                </ul>
                <p className="text-green-400 font-medium">
                  We never sell, share, or monetize your personal data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Lock className="w-5 h-5" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We provide several privacy features:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Custom Slugs:</strong> Hide your Spotify ID with custom URLs</li>
                  <li><strong>Private Displays:</strong> Control who can see your music activity</li>
                  <li><strong>Data Deletion:</strong> Remove all your data at any time</li>
                  <li><strong>Selective Sharing:</strong> Choose what information to display</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Music className="w-5 h-5" />
                  Spotify Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Our service integrates with Spotify's API using OAuth 2.0. We only request
                  the minimum permissions necessary:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><code className="bg-gray-800 px-2 py-1 rounded">user-read-currently-playing</code></li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded">user-read-recently-played</code></li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded">user-read-private</code></li>
                </ul>
                <p>
                  You can revoke access at any time through your
                  <a href="https://www.spotify.com/account/apps/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    Spotify account settings
                  </a>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We implement industry-standard security measures including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encrypted data transmission (HTTPS/TLS)</li>
                  <li>Secure database storage</li>
                  <li>Regular security audits</li>
                  <li>Limited data retention</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  If you have questions about this privacy policy or your data, please contact us at{" "}
                  <Link href="/support" className="text-green-400 hover:underline">
                    our support page
                  </Link>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600 text-black">
                <Music className="w-4 h-4 mr-2" />
                Back to SpotifyUtil
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                View Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
