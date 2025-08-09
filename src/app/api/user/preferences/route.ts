import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserPreferences, updateUserPreferences, createDefaultUserPreferences, isSlugTaken } from "@/lib/db"
import { generateCustomSlug, isValidSlug, isValidImageUrl, sanitizeImageUrl } from "@/lib/utils"
import { sanitizeHTML, logSecurityEvent } from "@/lib/security"

// Simple input validation function
function validateUserPreferencesInput(data: any): boolean {
  if (!data || typeof data !== 'object') return false

  // Validate display settings if present
  if (data.displaySettings && typeof data.displaySettings !== 'object') return false
  if (data.displaySettings?.customTitle && typeof data.displaySettings.customTitle !== 'string') return false
  if (data.displaySettings?.customDescription && typeof data.displaySettings.customDescription !== 'string') return false

  // Validate privacy settings if present
  if (data.privacySettings && typeof data.privacySettings !== 'object') return false
  if (data.privacySettings?.isPublic !== undefined && typeof data.privacySettings.isPublic !== 'boolean') return false

  // Validate public display settings if present
  if (data.publicDisplaySettings && typeof data.publicDisplaySettings !== 'object') return false
  if (data.publicDisplaySettings?.showLyrics !== undefined && typeof data.publicDisplaySettings.showLyrics !== 'boolean') return false

  return true
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { endpoint: '/api/user/preferences' }, request)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let preferences = await getUserPreferences(session.userId)

    // If no preferences exist, create and return defaults
    if (!preferences) {
      await createDefaultUserPreferences(session.userId, session.spotifyId || '')
      preferences = await getUserPreferences(session.userId)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('API_ERROR', { endpoint: '/api/user/preferences', error: errorMessage }, request)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { endpoint: '/api/user/preferences' }, request)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Enhanced input validation
    if (!validateUserPreferencesInput(body)) {
      logSecurityEvent('INVALID_INPUT', { endpoint: '/api/user/preferences', userId: session.userId }, request)
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      )
    }

    // Validate and sanitize text inputs
    if (body.displaySettings?.customTitle && typeof body.displaySettings.customTitle === 'string') {
      body.displaySettings.customTitle = sanitizeHTML(body.displaySettings.customTitle.slice(0, 100))
    }

    if (body.displaySettings?.customDescription && typeof body.displaySettings.customDescription === 'string') {
      body.displaySettings.customDescription = sanitizeHTML(body.displaySettings.customDescription.slice(0, 500))
    }

    // Validate custom slug if provided
    if (body.privacySettings?.customSlug) {
      const slug = body.privacySettings.customSlug
      if (!isValidSlug(slug)) {
        return NextResponse.json(
          { error: "Invalid custom slug format" },
          { status: 400 }
        )
      }

      // Check if slug is already taken by another user
      const slugTaken = await isSlugTaken(slug, session.userId)
      if (slugTaken) {
        return NextResponse.json(
          { error: "This custom slug is already taken. Please choose a different one." },
          { status: 409 }
        )
      }
    }

    // Validate background image URL if provided
    if (body.displaySettings?.backgroundImage) {
      const imageUrl = body.displaySettings.backgroundImage.trim()

      // Allow empty string to remove background
      if (imageUrl !== '') {
        if (!isValidImageUrl(imageUrl)) {
          return NextResponse.json(
            { error: "Invalid image URL. Please use a valid HTTPS image URL from a supported domain." },
            { status: 400 }
          )
        }
        // Sanitize the URL
        body.displaySettings.backgroundImage = sanitizeImageUrl(imageUrl)
      }
    }

    // Generate a new custom slug if user wants one but didn't provide
    if (body.privacySettings?.isPublic && !body.privacySettings?.customSlug) {
      body.privacySettings.customSlug = generateCustomSlug()
    }

    await updateUserPreferences(session.userId, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('API_ERROR', { endpoint: '/api/user/preferences', error: errorMessage }, request)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}
