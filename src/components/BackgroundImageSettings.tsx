'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface BackgroundImageSettingsProps {
  currentBackgroundImage?: string
  onBackgroundImageChange?: (url: string | null) => void
}

export function BackgroundImageSettings({
  currentBackgroundImage,
  onBackgroundImageChange
}: BackgroundImageSettingsProps) {
  const [imageUrl, setImageUrl] = useState(currentBackgroundImage || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSetBackground = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter a valid image URL")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/background-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backgroundImageUrl: imageUrl.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onBackgroundImageChange?.(imageUrl.trim())
        toast.success("Background image updated successfully")
      } else {
        throw new Error('Failed to update background image')
      }
    } catch (error) {
      console.error('Error updating background image:', error)
      toast.error("Failed to update background image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBackground = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/background-image', {
        method: 'DELETE',
      })

      if (response.ok) {
        setImageUrl('')
        onBackgroundImageChange?.(null)
        toast.success("Background image removed successfully")
      } else {
        throw new Error('Failed to remove background image')
      }
    } catch (error) {
      console.error('Error removing background image:', error)
      toast.error("Failed to remove background image")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Background Image</CardTitle>
        <CardDescription>
          Add a custom background image to your display. Use a direct image URL (jpg, png, gif, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="background-url">Image URL</Label>
          <Input
            id="background-url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative w-full h-32 border rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt="Background preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludmFsaWQgSW1hZ2U8L3RleHQ+PC9zdmc+'
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSetBackground}
            disabled={isLoading || !imageUrl.trim()}
          >
            {isLoading ? 'Updating...' : 'Set Background'}
          </Button>

          {currentBackgroundImage && (
            <Button
              variant="outline"
              onClick={handleRemoveBackground}
              disabled={isLoading}
            >
              Remove Background
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Use high-quality images for best results</li>
            <li>Recommended resolution: 1920x1080 or higher</li>
            <li>Dark/subtle images work best with most styles</li>
            <li>Ensure you have permission to use the image</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
