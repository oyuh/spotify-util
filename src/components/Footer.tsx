"use client"

import Link from "next/link"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

export default function Footer() {
  const [commitInfo, setCommitInfo] = useState<{
    hash: string
    date: string
    message: string
  } | null>(null)

  // Fetch commit info
  useEffect(() => {
    fetchCommitInfo()
  }, [])

  const fetchCommitInfo = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/oyuh/spotify-util/commits?per_page=1')
      if (response.ok) {
        const [latestCommit] = await response.json()
        setCommitInfo({
          hash: latestCommit.sha.substring(0, 7), // Short hash
          date: new Date(latestCommit.commit.committer.date).toLocaleString(),
          message: latestCommit.commit.message
        })
      }
    } catch (error) {
      console.error('Failed to fetch commit info:', error)
    }
  }

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} JamLog. Not affiliated with Spotify AB.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/support" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Music displays that actually don't suck
            </p>
          </div>

          {/* Commit Info - Clickable */}
          {commitInfo && (
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Latest</span>
                <Link
                  href={`https://github.com/oyuh/spotify-util/commit/${commitInfo.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <code className="bg-muted px-2 py-1 rounded font-mono hover:bg-muted/80">
                    {commitInfo.hash}
                  </code>
                </Link>
              </div>
              <div className="hidden sm:block">
                <Link
                  href={`https://github.com/oyuh/spotify-util/commit/${commitInfo.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {commitInfo.date}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
