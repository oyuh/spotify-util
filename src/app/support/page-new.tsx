'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, MessageCircle, Mail, Github, HelpCircle, Bug, Lightbulb, Shield, Clock, Send, ExternalLink, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SupportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formType: string) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll respond within 24-48 hours.')
      setIsSubmitting(false)
      const form = e.currentTarget
      form.reset()
    }, 1000)
  }

  const supportOptions = [
    {
      title: "General Questions",
      description: "Get help with using SpotifyUtil features and functionality",
      icon: <HelpCircle className="w-5 h-5" />,
      badge: "Popular",
      badgeVariant: "default" as const,
      modalType: "general"
    },
    {
      title: "Report a Bug",
      description: "Found something broken? Let us know so we can fix it",
      icon: <Bug className="w-5 h-5" />,
      badge: "Priority",
      badgeVariant: "destructive" as const,
      modalType: "bug"
    },
    {
      title: "Feature Request",
      description: "Have an idea for a new theme or feature? We'd love to hear it",
      icon: <Lightbulb className="w-5 h-5" />,
      badge: "New",
      badgeVariant: "secondary" as const,
      modalType: "feature"
    },
    {
      title: "Privacy & Security",
      description: "Questions about data handling and account security",
      icon: <Shield className="w-5 h-5" />,
      badge: "Secure",
      badgeVariant: "outline" as const,
      modalType: "security"
    }
  ]

  const faqs = [
    {
      question: "How do I create a custom display URL?",
      answer: "Go to your dashboard, navigate to preferences, and generate a custom slug. This will create a privacy-friendly URL like spotify-util.com/display/your-custom-name"
    },
    {
      question: "Why isn't my currently playing track showing?",
      answer: "Make sure you're actively playing music on Spotify and that you've granted the necessary permissions. Try refreshing your display page."
    },
    {
      question: "How do I change my display theme?",
      answer: "Visit your dashboard and select from our available themes including minimal, cyberpunk, retro-wave, and more. Changes apply instantly."
    },
    {
      question: "Is my Spotify data private?",
      answer: "Yes! We only access the minimum required data (currently playing track) and provide privacy controls like custom URLs to hide your Spotify ID."
    },
    {
      question: "How do I add custom CSS to my display?",
      answer: "In your settings modal under the Styling tab, you'll find a Custom CSS section. Click 'View Docs' for examples and best practices."
    }
  ]

  const ContactForm = ({ type, title, description }: { type: string; title: string; description: string }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {type === 'bug' && <Bug className="w-5 h-5" />}
          {type === 'feature' && <Lightbulb className="w-5 h-5" />}
          {type === 'security' && <Shield className="w-5 h-5" />}
          {type === 'general' && <Mail className="w-5 h-5" />}
          {title}
        </DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => handleFormSubmit(e, type)} className="space-y-4 mt-6">
        <div>
          <Label htmlFor={`${type}-email`}>Email</Label>
          <Input
            id={`${type}-email`}
            name="email"
            type="email"
            required
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor={`${type}-subject`}>Subject</Label>
          <Input
            id={`${type}-subject`}
            name="subject"
            required
            placeholder={
              type === 'bug' ? 'Brief description of the bug' :
              type === 'feature' ? 'Feature idea title' :
              type === 'security' ? 'Security/privacy concern' :
              'What can we help you with?'
            }
          />
        </div>
        <div>
          <Label htmlFor={`${type}-message`}>Message</Label>
          <Textarea
            id={`${type}-message`}
            name="message"
            required
            rows={4}
            placeholder={
              type === 'bug' ? 'Please describe the bug, steps to reproduce, and what you expected to happen...' :
              type === 'feature' ? 'Describe your feature idea and how it would be useful...' :
              type === 'security' ? 'Please describe your security or privacy concern...' :
              'Please describe your question or issue in detail...'
            }
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </DialogContent>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Support Center</h1>
              <p className="text-muted-foreground">Get help with SpotifyUtil features and functionality</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">24-48h Response</Badge>
            <Badge variant="outline">Multiple Contact Methods</Badge>
            <Badge variant="outline">Community Support</Badge>
          </div>
        </div>

        {/* Support Options */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>How can we help you?</CardTitle>
            <CardDescription>
              Choose the option that best describes your question or issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {supportOptions.map((option, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {option.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                          </div>
                        </div>
                        <Badge variant={option.badgeVariant}>{option.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </DialogTrigger>
                  <ContactForm
                    type={option.modalType}
                    title={option.title}
                    description={option.description}
                  />
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to common questions about SpotifyUtil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Other ways to get help and stay connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <Github className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">GitHub</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Report bugs and contribute
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://github.com/oyuh/spotify-util', '_blank')}>
                  View Repository
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">Community</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Join our Discord community
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://discord.gg/your-server', '_blank')}>
                  Join Discord
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">Response Time</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  We typically respond within
                </p>
                <Badge variant="secondary" className="text-xs">
                  24-48 Hours
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push('/docs')}>
                View Documentation
              </Button>
              <Button variant="outline" onClick={() => router.push('/docs/custom-css')}>
                CSS Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
