'use client'

import { useEffect, useState } from 'react'

interface UseBackgroundImageOptions {
  imageUrl?: string
  containerId?: string
  fallbackColor?: string
  retryCount?: number
}

interface BackgroundImageState {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  errorMessage?: string
}

export function useBackgroundImage({
  imageUrl,
  containerId = 'background-container',
  fallbackColor = 'transparent',
  retryCount = 2
}: UseBackgroundImageOptions) {
  const [state, setState] = useState<BackgroundImageState>({
    isLoading: false,
    isLoaded: false,
    hasError: false
  })

  useEffect(() => {
    if (!imageUrl) {
      // Clear any existing background
      const container = document.getElementById(containerId) || document.body
      container.style.backgroundImage = ''
      container.style.backgroundColor = fallbackColor
      setState({ isLoading: false, isLoaded: false, hasError: false })
      return
    }

    setState({ isLoading: true, isLoaded: false, hasError: false })

    let attempts = 0
    const maxAttempts = retryCount + 1

    const tryLoadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        const timeout = setTimeout(() => {
          img.onload = null
          img.onerror = null
          reject(new Error('Image load timeout'))
        }, 10000) // 10 second timeout

        img.onload = () => {
          clearTimeout(timeout)
          resolve(url)
        }

        img.onerror = () => {
          clearTimeout(timeout)
          reject(new Error('Failed to load image'))
        }

        img.src = url
      })
    }

    const loadWithRetry = async () => {
      while (attempts < maxAttempts) {
        try {
          attempts++
          console.log(`🖼️ Background Image: Attempt ${attempts}/${maxAttempts} for ${imageUrl}`)

          // Try different URL formats for common services
          let urlsToTry = [imageUrl]

          // Special handling for imgur URLs
          if (imageUrl.includes('i.imgur.com')) {
            // Try both direct and indirect formats
            urlsToTry = [
              imageUrl,
              imageUrl.replace('https://i.imgur.com/', 'https://imgur.com/'),
              imageUrl.includes('.jpg') ? imageUrl : `${imageUrl}.jpg`,
              imageUrl.includes('.png') ? imageUrl : `${imageUrl}.png`
            ]
          }

          // Special handling for Discord CDN
          if (imageUrl.includes('cdn.discordapp.com')) {
            urlsToTry = [
              imageUrl,
              imageUrl.includes('?') ? imageUrl.split('?')[0] : imageUrl
            ]
          }

          for (const url of urlsToTry) {
            try {
              await tryLoadImage(url)

              // Success! Apply the background
              const container = document.getElementById(containerId) || document.body
              container.style.backgroundImage = `url("${url}")`
              container.style.backgroundSize = 'cover'
              container.style.backgroundPosition = 'center'
              container.style.backgroundRepeat = 'no-repeat'
              container.style.backgroundAttachment = 'fixed'

              console.log(`🖼️ Background Image: Successfully loaded ${url}`)
              setState({ isLoading: false, isLoaded: true, hasError: false })
              return
            } catch (urlError) {
              console.warn(`🖼️ Background Image: Failed to load ${url}:`, urlError)
              continue
            }
          }

          throw new Error('All URL variants failed')
        } catch (error) {
          console.error(`🖼️ Background Image: Attempt ${attempts} failed:`, error)

          if (attempts >= maxAttempts) {
            // Final failure
            const container = document.getElementById(containerId) || document.body
            container.style.backgroundImage = ''
            container.style.backgroundColor = fallbackColor

            setState({
              isLoading: false,
              isLoaded: false,
              hasError: true,
              errorMessage: `Failed to load background image after ${maxAttempts} attempts`
            })
            return
          }

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
        }
      }
    }

    loadWithRetry()

    // Cleanup function
    return () => {
      const container = document.getElementById(containerId) || document.body
      container.style.backgroundImage = ''
      container.style.backgroundColor = fallbackColor
    }
  }, [imageUrl, containerId, fallbackColor, retryCount])

  return state
}

// Test function for validating image URLs
export async function testImageUrl(url: string): Promise<{ valid: boolean; error?: string }> {
  if (!url) {
    return { valid: false, error: 'No URL provided' }
  }

  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        img.onload = null
        img.onerror = null
        resolve({ valid: false, error: 'Timeout - image took too long to load' })
      }, 8000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve({ valid: true })
      }

      img.onerror = () => {
        clearTimeout(timeout)
        resolve({ valid: false, error: 'Failed to load image - check URL and CORS settings' })
      }

      img.src = url
    })
  } catch (error) {
    return { valid: false, error: `Error testing image: ${error}` }
  }
}
