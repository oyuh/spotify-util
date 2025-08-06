import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateCustomSlug } from "@/lib/utils"
import { isSlugTaken, updateUserPreferences, getUserPreferences } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
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
      return NextResponse.json(
        { error: "Failed to generate unique slug" },
        { status: 500 }
      )
    }

    // Save the new slug to the user's preferences
    const currentPrefs = await getUserPreferences(session.userId)
    await updateUserPreferences(session.userId, {
      privacySettings: {
        isPublic: currentPrefs?.privacySettings?.isPublic ?? true,
        hideSpotifyId: currentPrefs?.privacySettings?.hideSpotifyId ?? true,
        customSlug: slug
      }
    })

    console.log(`Generated and saved new slug for user ${session.userId}: ${slug}`)

    return NextResponse.json({ slug })
  } catch (error) {
    console.error("Error generating custom slug:", error)
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    )
  }
}
