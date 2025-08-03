import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a custom slug for privacy-first URLs
export function generateCustomSlug(length: number = 12): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, length)
  return nanoid()
}

// Format duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Format progress as percentage
export function formatProgress(progressMs: number, durationMs: number): number {
  if (!progressMs || !durationMs) return 0
  return Math.round((progressMs / durationMs) * 100)
}

// Debounce function for API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Validate custom slug format
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-zA-Z0-9_-]+$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 30
}

// Get the primary image from Spotify images array
export function getPrimaryImage(images: Array<{ url: string; height: number; width: number }>): string | null {
  if (!images || images.length === 0) return null

  // Sort by size (largest first) and return the first one
  const sortedImages = images.sort((a, b) => (b.height * b.width) - (a.height * a.width))
  return sortedImages[0]?.url || null
}

// Get a medium-sized image (good for display)
export function getMediumImage(images: Array<{ url: string; height: number; width: number }>): string | null {
  if (!images || images.length === 0) return null

  // Try to find an image around 300px, otherwise return the middle one
  const mediumImage = images.find(img => img.height >= 250 && img.height <= 400)
  if (mediumImage) return mediumImage.url

  // Fallback to middle size
  const sortedImages = images.sort((a, b) => (b.height * b.width) - (a.height * a.width))
  const middleIndex = Math.floor(sortedImages.length / 2)
  return sortedImages[middleIndex]?.url || sortedImages[0]?.url || null
}

// Sanitize CSS to prevent XSS
export function sanitizeCSS(css: string): string {
  // Remove potentially dangerous CSS properties
  const dangerousProperties = [
    'javascript:',
    'expression(',
    '@import',
    'behavior:',
    '-moz-binding',
    'content:',
  ]

  let sanitized = css
  dangerousProperties.forEach(prop => {
    const regex = new RegExp(prop, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  return sanitized
}

// Check if a URL is from Spotify
export function isSpotifyUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'open.spotify.com' || urlObj.hostname === 'spotify.com'
  } catch {
    return false
  }
}

// Extract track ID from Spotify URL
export function extractSpotifyTrackId(url: string): string | null {
  try {
    const match = url.match(/track\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
