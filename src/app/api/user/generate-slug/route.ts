import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateCustomSlug } from "@/lib/utils"
import { isSlugTaken, updateUserPreferences, getUserPreferences } from "@/lib/db"
import { logSecurityEvent } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { endpoint: '/api/user/generate-slug' }, request)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let slug: string
    let attempts = 0
    const maxAttempts = 10

    // Generate a unique slug
    do {
      slug = generateCustomSlug()
      const slugAlreadyTaken = await isSlugTaken(slug, session.userId)

      if (!slugAlreadyTaken) {
        break
      }

      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      logSecurityEvent('SLUG_GENERATION_FAILED', { userId: session.userId, attempts }, request)
      return NextResponse.json(
        { error: "Failed to generate unique slug" },
        { status: 500 }
      )
    }

    // Save the new slug to the user's preferences
    const currentPrefs = await getUserPreferences(session.userId)

    if (!currentPrefs) {
      logSecurityEvent('MISSING_USER_PREFERENCES', { userId: session.userId }, request)
      return NextResponse.json(
        { error: "User preferences not found" },
        { status: 404 }
      )
    }

    await updateUserPreferences(session.userId, {
      privacySettings: {
        isPublic: currentPrefs?.privacySettings?.isPublic ?? true,
        hideSpotifyId: currentPrefs?.privacySettings?.hideSpotifyId ?? true,
        customSlug: slug
      }
    })

    // Log successful slug generation (without exposing the slug)
    logSecurityEvent('SLUG_GENERATED', { userId: session.userId }, request)

    return NextResponse.json({ slug })
  } catch (error) {
    console.error("Error generating custom slug:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logSecurityEvent('API_ERROR', { endpoint: '/api/user/generate-slug', error: errorMessage }, request)
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    )
  }
}
