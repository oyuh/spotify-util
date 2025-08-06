'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
  const router = useRouter()

  const keyTerms = [
    {
      title: "Account Usage",
      description: "You must have a valid Spotify account and use our service responsibly",
      icon: <Users className="w-5 h-5" />,
      details: [
        "Must be 13+ years old to use the service",
        "One account per user",
        "Don't share your account credentials",
        "Use the service for personal, non-commercial purposes"
      ]
    },
    {
      title: "Content & Display",
      description: "Guidelines for what content can be displayed and how",
      icon: <FileText className="w-5 h-5" />,
      details: [
        "Only display content you have rights to",
        "No harmful, offensive, or illegal content",
        "Custom CSS must not break the service",
        "Respect copyright and intellectual property"
      ]
    },
    {
      title: "Service Availability",
      description: "Our commitment to service uptime and limitations",
      icon: <Shield className="w-5 h-5" />,
      details: [
        "Service provided 'as is' without warranties",
        "We aim for 99.9% uptime but cannot guarantee it",
        "Features may change or be discontinued",
        "Scheduled maintenance may cause temporary outages"
      ]
    },
    {
      title: "Prohibited Uses",
      description: "Activities that are not allowed on our platform",
      icon: <AlertTriangle className="w-5 h-5" />,
      details: [
        "No automated scraping or data mining",
        "Don't attempt to reverse engineer the service",
        "No spam, harassment, or abuse",
        "Don't violate any applicable laws or regulations"
      ]
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
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Your rights and responsibilities when using JamLog</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">Fair Use</Badge>
            <Badge variant="outline">User Friendly</Badge>
            <Badge variant="outline">Transparent</Badge>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              <strong className="text-primary">Last updated:</strong> August 5, 2025
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to JamLog</CardTitle>
            <CardDescription>
              By using our service, you agree to these terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              These Terms of Service ("Terms") govern your use of JamLog or Spotify-Util ("Service") operated by our team ("us", "we", or "our").
              By accessing or using our service, you agree to be bound by these Terms.
            </p>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🤝 Simple Summary</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Use JamLog to display your music, be respectful to others, don't break anything,
                and we'll provide you with a great service. That's the gist of it!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Key Terms
            </CardTitle>
            <CardDescription>
              The most important things you need to know
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {keyTerms.map((term, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {term.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{term.title}</h4>
                      <p className="text-sm text-muted-foreground">{term.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {term.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spotify Integration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Spotify Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              JamLog integrates with Spotify's Web API to display your music data. Please note:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Spotify's Terms Apply</h5>
                <p className="text-xs text-muted-foreground">
                  Your use of Spotify through our service is also subject to Spotify's Terms of Service
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">API Limitations</h5>
                <p className="text-xs text-muted-foreground">
                  Service functionality depends on Spotify's API availability and rate limits
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Account Linking</h5>
                <p className="text-xs text-muted-foreground">
                  You can disconnect your Spotify account at any time through your account settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Your privacy is important to us. Here's how we handle your data:
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">Minimal Collection</h5>
                <p className="text-xs text-muted-foreground">We only collect data necessary for the service</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">User Control</h5>
                <p className="text-xs text-muted-foreground">You control what data is displayed publicly</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">No Selling</h5>
                <p className="text-xs text-muted-foreground">We never sell your data to third parties</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">GDPR Compliant</h5>
                <p className="text-xs text-muted-foreground">Full compliance with privacy regulations</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              For detailed information, please read our <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push('/privacy')}>Privacy Policy</Button>.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              While we strive to provide a reliable service, please understand:
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <p className="text-sm">The service is provided "as is" without warranties of any kind</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <p className="text-sm">We are not liable for any indirect, incidental, or consequential damages</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <p className="text-sm">Service availability may be affected by factors outside our control</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              We may update these Terms from time to time. When we do:
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm">We'll notify you of significant changes via email or service announcement</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm">The "Last updated" date at the top will be changed</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm">Continued use of the service constitutes acceptance of the new terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Questions About These Terms?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" onClick={() => router.push('/support')}>
                Contact Support
              </Button>
              <Button variant="outline" onClick={() => window.open('mailto:legal@spotify-util.com')}>
                Email Legal Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
