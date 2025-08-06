"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Music, ArrowLeft, MessageCircle, Mail, Github,
  HelpCircle, Bug, Lightbulb, Shield, Clock, Send, ExternalLink
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Support() {
  const router = useRouter()
  const [formStatus, setFormStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Formspree form submission handler
  const handleFormSubmit = async (formData: FormData, formType: string) => {
    setIsSubmitting(true)
    setFormStatus({type: null, message: ''})

    try {
      const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL
      if (!formspreeUrl) {
        throw new Error('Formspree URL not configured')
      }

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setTimeout(() => {
          const form = document.querySelector('form') as HTMLFormElement
          form?.reset()
        }, 100)
      } else {
        setFormStatus({type: 'error', message: 'Failed to send message. Please try again.'})
      }
    } catch (error) {
      setFormStatus({type: 'error', message: 'An error occurred. Please check your configuration and try again.'})
    } finally {
      setIsSubmitting(false)
    }
  }
  const supportOptions = [
    {
      icon: HelpCircle,
      title: "General Questions",
      description: "Get help with using SpotifyUtil features and functionality",
      action: "Browse FAQ",
      badge: "Popular",
      modalType: "faq"
    },
    {
      icon: Bug,
      title: "Report a Bug",
      description: "Found something broken? Let us know so we can fix it",
      action: "Report Issue",
      badge: "Quick Response",
      modalType: "bug"
    },
    {
      icon: Lightbulb,
      title: "Feature Request",
      description: "Have an idea for a new theme or feature? We'd love to hear it",
      action: "Suggest Feature",
      badge: "New",
      modalType: "feature"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Questions about data handling and account security",
      action: "Contact Security",
      badge: "Priority",
      modalType: "security"
    }
  ]

  // Modal Components
  const SuccessModal = () => (
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-800 text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-green-400 text-2xl">
            <Send className="w-8 h-8" />
            Message Sent!
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-4">
            Thank you for reaching out! We've received your message and will respond within 24-48 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="bg-green-500 hover:bg-green-600 text-black px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const FAQModal = () => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <HelpCircle className="w-5 h-5" />
          Frequently Asked Questions
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Find answers to common questions about SpotifyUtil
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 mt-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </DialogContent>
  )

  const BugReportModal = () => (
    <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <Bug className="w-5 h-5" />
          Report a Bug
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Help us fix issues by reporting bugs you encounter
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_subject', 'Bug Report - SpotifyUtil')
        formData.append('form_type', 'bug_report')
        await handleFormSubmit(formData, 'bug')
      }} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="bug-email" className="text-white">Email</Label>
          <Input
            id="bug-email"
            name="email"
            type="email"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="bug-title" className="text-white">Bug Title</Label>
          <Input
            id="bug-title"
            name="title"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Brief description of the bug"
          />
        </div>
        <div>
          <Label htmlFor="bug-description" className="text-white">Description</Label>
          <Textarea
            id="bug-description"
            name="description"
            required
            rows={4}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
          />
        </div>
        <div>
          <Label htmlFor="bug-browser" className="text-white">Browser/Device</Label>
          <Input
            id="bug-browser"
            name="browser"
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Chrome, Firefox, Safari, Mobile, etc."
          />
        </div>
        {formStatus.type && (
          <Alert className={formStatus.type === 'success' ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription className={formStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {formStatus.message}
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-black"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Report Bug
            </>
          )}
        </Button>
      </form>
    </DialogContent>
  )

  const FeatureRequestModal = () => (
    <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <Lightbulb className="w-5 h-5" />
          Feature Request
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Share your ideas for new features or improvements
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_subject', 'Feature Request - SpotifyUtil')
        formData.append('form_type', 'feature_request')
        await handleFormSubmit(formData, 'feature')
      }} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="feature-email" className="text-white">Email</Label>
          <Input
            id="feature-email"
            name="email"
            type="email"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="feature-title" className="text-white">Feature Title</Label>
          <Input
            id="feature-title"
            name="title"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Brief name for your feature idea"
          />
        </div>
        <div>
          <Label htmlFor="feature-description" className="text-white">Description</Label>
          <Textarea
            id="feature-description"
            name="description"
            required
            rows={4}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Detailed description of the feature, how it would work, why it would be useful..."
          />
        </div>
        <div>
          <Label htmlFor="feature-priority" className="text-white">Priority Level</Label>
          <select
            id="feature-priority"
            name="priority"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          >
            <option value="low">Low - Nice to have</option>
            <option value="medium">Medium - Would be helpful</option>
            <option value="high">High - Really needed</option>
          </select>
        </div>
        {formStatus.type && (
          <Alert className={formStatus.type === 'success' ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription className={formStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {formStatus.message}
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-black"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feature Request
            </>
          )}
        </Button>
      </form>
    </DialogContent>
  )

  const SecurityModal = () => (
    <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <Shield className="w-5 h-5" />
          Security Contact
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Report security issues or ask privacy-related questions
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_subject', 'Security Contact - SpotifyUtil')
        formData.append('form_type', 'security')
        await handleFormSubmit(formData, 'security')
      }} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="security-email" className="text-white">Email</Label>
          <Input
            id="security-email"
            name="email"
            type="email"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="security-name" className="text-white">Name</Label>
          <Input
            id="security-name"
            name="name"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="security-type" className="text-white">Issue Type</Label>
          <select
            id="security-type"
            name="issue_type"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            required
          >
            <option value="">Select issue type</option>
            <option value="security_vulnerability">Security Vulnerability</option>
            <option value="privacy_question">Privacy Question</option>
            <option value="data_deletion">Data Deletion Request</option>
            <option value="account_security">Account Security</option>
            <option value="other">Other Security/Privacy Concern</option>
          </select>
        </div>
        <div>
          <Label htmlFor="security-subject" className="text-white">Subject</Label>
          <Input
            id="security-subject"
            name="subject"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Brief subject line"
          />
        </div>
        <div>
          <Label htmlFor="security-message" className="text-white">Message</Label>
          <Textarea
            id="security-message"
            name="message"
            required
            rows={4}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Detailed description of your security/privacy concern..."
          />
        </div>
        {formStatus.type === 'error' && (
          <Alert className="border-red-500">
            <AlertDescription className="text-red-400">
              {formStatus.message}
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-black"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Security Message
            </>
          )}
        </Button>
      </form>
    </DialogContent>
  );

  const EmailSupportModal = () => (
    <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <Mail className="w-5 h-5" />
          Email Support
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Send us a detailed message and we'll respond within 24-48 hours
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_subject', 'General Support - SpotifyUtil')
        formData.append('form_type', 'general_support')
        await handleFormSubmit(formData, 'email')
      }} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="email-support-email" className="text-white">Email</Label>
          <Input
            id="email-support-email"
            name="email"
            type="email"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="email-support-name" className="text-white">Name</Label>
          <Input
            id="email-support-name"
            name="name"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="email-support-subject" className="text-white">Subject</Label>
          <Input
            id="email-support-subject"
            name="subject"
            required
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What can we help you with?"
          />
        </div>
        <div>
          <Label htmlFor="email-support-message" className="text-white">Message</Label>
          <Textarea
            id="email-support-message"
            name="message"
            required
            rows={5}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Please describe your question or issue in detail..."
          />
        </div>
        {formStatus.type && (
          <Alert className={formStatus.type === 'success' ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription className={formStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {formStatus.message}
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-black"
        >
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

  const GitHubModal = () => (
    <DialogContent className="max-w-lg bg-gray-900 border-gray-800">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-400">
          <Github className="w-5 h-5" />
          GitHub Issues
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Report bugs and request features on our GitHub repository
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 mt-6">
        <p className="text-gray-300">
          For technical issues and feature requests, you can also create issues directly on our GitHub repository.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => window.open('https://github.com/oyuh/spotify-util/issues/new?template=bug_report.md', '_blank')}
            variant="outline"
            className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
          >
            <Bug className="w-4 h-4 mr-2" />
            Report Bug on GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => window.open('https://github.com/oyuh/spotify-util/issues/new?template=feature_request.md', '_blank')}
            variant="outline"
            className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Request Feature on GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => window.open('https://github.com/oyuh/spotify-util/issues', '_blank')}
            variant="outline"
            className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
          >
            <Github className="w-4 h-4 mr-2" />
            Browse All Issues
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  const faqs = [
    {
      question: "How do I create a custom display URL?",
      answer: "Go to your dashboard, navigate to preferences, and generate a custom slug. This will create a privacy-friendly URL like spotify-util.com/display/your-custom-name"
    },
    {
      question: "Can I upload my own background images?",
      answer: "Yes! In your display preferences, you can upload custom background images. Supported formats include JPG, PNG, and WebP up to 5MB."
    },
    {
      question: "Why isn't my currently playing track showing?",
      answer: "Make sure you're actively playing music on Spotify and that you've granted the necessary permissions. Try refreshing your display page."
    },
    {
      question: "How do I change my display theme?",
      answer: "Visit your dashboard and select from 14+ available themes including minimal, cyberpunk, retro-wave, and more. Changes apply instantly."
    },
    {
      question: "Is my Spotify data private?",
      answer: "Yes! We only access the minimum required data (currently playing track) and provide privacy controls like custom URLs to hide your Spotify ID."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-400" />
              <h1 className="text-3xl font-bold">Support Center</h1>
            </div>
          </div>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl">
            Need help with SpotifyUtil? Choose from the options below or browse our frequently asked questions.
          </p>

          {/* Support Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                          <option.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-green-500 text-black border-0">
                          {option.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl group-hover:text-green-400 transition-colors">
                        {option.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-base leading-relaxed mb-4">
                        {option.description}
                      </p>
                      <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                {option.modalType === 'faq' && <FAQModal />}
                {option.modalType === 'bug' && <BugReportModal />}
                {option.modalType === 'feature' && <FeatureRequestModal />}
                {option.modalType === 'security' && <SecurityModal />}
              </Dialog>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-gray-900/30 border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-gray-900/50 border-gray-800 text-center cursor-pointer hover:bg-gray-900/70 transition-all">
                  <CardContent className="p-6">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Get help via email with detailed responses
                    </p>
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <EmailSupportModal />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-gray-900/50 border-gray-800 text-center cursor-pointer hover:bg-gray-900/70 transition-all">
                  <CardContent className="p-6">
                    <Github className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">GitHub Issues</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Report bugs and request features
                    </p>
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                      Open Issue
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <GitHubModal />
            </Dialog>

            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                <p className="text-gray-400 text-sm mb-4">
                  We typically respond within 24-48 hours
                </p>
                <Badge className="bg-green-500 text-black">
                  Fast Support
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="bg-gray-900/30 border-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-green-400">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Link href="/dashboard" className="text-gray-400 hover:text-green-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600 text-black">
                <Music className="w-4 h-4 mr-2" />
                Back to SpotifyUtil
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal />
    </div>
  )
}
