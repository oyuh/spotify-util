'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Eye, Database, Lock, Users, Clock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  const dataTypes = [
    {
      title: "Spotify Profile Data",
      description: "Your public profile information including display name and profile picture",
      icon: <Users className="w-5 h-5" />,
      required: true,
      usage: "Used to personalize your experience and identify your account"
    },
    {
      title: "Currently Playing Track",
      description: "Information about the song you're currently listening to",
      icon: <Eye className="w-5 h-5" />,
      required: true,
      usage: "Essential for displaying your current music on your public display page"
    },
    {
      title: "Recently Played Tracks",
      description: "Your recent listening history (optional)",
      icon: <Clock className="w-5 h-5" />,
      required: false,
      usage: "Only collected if you enable recent tracks display in your preferences"
    },
    {
      title: "Display Preferences",
      description: "Your customization settings and theme preferences",
      icon: <Database className="w-5 h-5" />,
      required: true,
      usage: "Stored to maintain your stream settings and custom CSS"
    }
  ]

  const privacyFeatures = [
    {
      title: "Custom URLs",
      description: "Generate custom display URLs to hide your Spotify ID from public view",
      icon: <Lock className="w-5 h-5" />
    },
    {
      title: "Private Mode",
      description: "Make your display accessible only via custom URL, not your Spotify ID",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Data Control",
      description: "Choose exactly what information is displayed on your public page",
      icon: <Eye className="w-5 h-5" />
    },
    {
      title: "Account Deletion",
      description: "Request complete deletion of your data at any time",
      icon: <Database className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">How we protect and handle your data</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">GDPR Compliant</Badge>
            <Badge variant="outline">Minimal Data Collection</Badge>
            <Badge variant="outline">User Control</Badge>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              <strong className="text-primary">Last updated:</strong> August 5, 2025
            </p>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Our commitment to your privacy and data protection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              JamLog is designed with privacy at its core. We collect only the minimum data necessary to provide
              our service and give you complete control over what information is displayed publicly.
            </p>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ What We Don't Do</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• We don't sell your data to third parties</li>
                <li>• We don't store your Spotify login credentials</li>
                <li>• We don't track your browsing behavior outside our app</li>
                <li>• We don't collect data you haven't explicitly shared</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data We Collect
            </CardTitle>
            <CardDescription>
              Transparent information about what data we access and why
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataTypes.map((dataType, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        {dataType.icon}
                      </div>
                      <h4 className="font-medium">{dataType.title}</h4>
                    </div>
                    <Badge variant={dataType.required ? "default" : "secondary"}>
                      {dataType.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{dataType.description}</p>
                  <p className="text-xs text-muted-foreground">{dataType.usage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Your Privacy Controls
            </CardTitle>
            <CardDescription>
              Tools and features to protect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {privacyFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h4 className="font-medium">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sharing & Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              We do not sell, trade, or share your personal data with third parties for marketing purposes.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Spotify Integration</h4>
                <p className="text-sm text-muted-foreground">
                  We use Spotify's Web API to access your music data. This connection is secured through OAuth 2.0
                  and you can revoke access at any time in your Spotify account settings.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Public Display Data</h4>
                <p className="text-sm text-muted-foreground">
                  Only the information you choose to display publicly is visible to others. You control what
                  appears on your display page through your privacy settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              We implement industry-standard security measures to protect your data:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Encryption</h5>
                <p className="text-xs text-muted-foreground">All data transmission uses HTTPS/SSL encryption</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Secure Storage</h5>
                <p className="text-xs text-muted-foreground">Data stored in secure, encrypted databases</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Access Control</h5>
                <p className="text-xs text-muted-foreground">Limited access to authorized personnel only</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Regular Audits</h5>
                <p className="text-xs text-muted-foreground">Security practices reviewed and updated regularly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
            <CardDescription>
              Under GDPR and other privacy laws, you have the following rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Right to Access</h5>
                  <p className="text-xs text-muted-foreground">Request a copy of the personal data we hold about you</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Right to Correction</h5>
                  <p className="text-xs text-muted-foreground">Request correction of inaccurate or incomplete data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Right to Deletion</h5>
                  <p className="text-xs text-muted-foreground">Request deletion of your personal data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">4</span>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Right to Portability</h5>
                  <p className="text-xs text-muted-foreground">Receive your data in a portable format</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Privacy Questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you have questions about this privacy policy or want to exercise your rights, contact us:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" onClick={() => router.push('/support')}>
                Contact Support
              </Button>
              <Button variant="outline" onClick={() => window.open('mailto:privacy@spotify-util.com')}>
                Email Privacy Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
