"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ArrowLeft, FileText, Shield, Gavel, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Terms() {
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
              <FileText className="w-6 h-6 text-green-400" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400">
              <strong className="text-green-400">Last updated:</strong> August 4, 2025
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  By using SpotifyUtil, you agree to these Terms of Service. If you do not agree
                  with any part of these terms, you may not use our service.
                </p>
                <p>
                  These terms may be updated from time to time. Continued use of the service
                  constitutes acceptance of any changes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Music className="w-5 h-5" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  SpotifyUtil is a web application that creates customizable displays of your
                  Spotify music activity. Our service includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Real-time display of currently playing music</li>
                  <li>14+ customizable themes and backgrounds</li>
                  <li>Privacy controls and custom URLs</li>
                  <li>Streaming and sharing capabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Gavel className="w-5 h-5" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>When using our service, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate information during account creation</li>
                  <li>Use the service in compliance with all applicable laws</li>
                  <li>Not attempt to reverse engineer or hack our systems</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use the service for illegal or harmful activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <AlertTriangle className="w-5 h-5" />
                  Content and Copyright
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Music content displayed through our service is provided by Spotify. We do not
                  own or claim rights to any music content.
                </p>
                <p>
                  Custom backgrounds you upload must be content you own or have permission to use.
                  You are responsible for ensuring your uploads do not violate copyright.
                </p>
                <p>
                  Our service design, code, and original content are protected by intellectual
                  property laws.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We strive to maintain high service availability, but we cannot guarantee
                  uninterrupted access. Our service may be temporarily unavailable due to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintenance and updates</li>
                  <li>Technical difficulties</li>
                  <li>Spotify API limitations</li>
                  <li>Force majeure events</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  SpotifyUtil is provided "as is" without warranties of any kind. We are not
                  liable for any damages arising from your use of our service.
                </p>
                <p className="text-yellow-400 font-medium">
                  This service is provided free of charge as a community tool for music enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  You may delete your account at any time. We may suspend or terminate accounts
                  that violate these terms.
                </p>
                <p>
                  Upon termination, your data will be deleted according to our privacy policy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Questions about these terms? Contact us through our{" "}
                  <Link href="/support" className="text-green-400 hover:underline">
                    support page
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
            <Link href="/privacy">
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                View Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
