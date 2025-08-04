import { NextRequest, NextResponse } from "next/server"
import { generateCustomSlug } from "@/lib/utils"
import { getUserBySlug, updateUserPreferences, getUserPreferences } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Simulate being the user with ID 688ebe078be59f856ce1882c
    const userId = "688ebe078be59f856ce1882c"

    let slug: string
    let attempts = 0
    const maxAttempts = 10

    // Generate a unique slug
    do {
      slug = generateCustomSlug()
      const existingUser = await getUserBySlug(slug)

      if (!existingUser) {
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

    // Get current preferences
    const currentPrefs = await getUserPreferences(userId)
    const oldSlug = currentPrefs?.privacySettings?.customSlug

    // Save the new slug to the user's preferences
    await updateUserPreferences(userId, {
      privacySettings: {
        isPublic: currentPrefs?.privacySettings?.isPublic ?? false,
        hideSpotifyId: currentPrefs?.privacySettings?.hideSpotifyId ?? true,
        customSlug: slug
      }
    })

    console.log(`Generated and saved new slug for user ${userId}: ${slug} (old: ${oldSlug})`)

    return NextResponse.json({
      slug,
      oldSlug,
      message: "New slug generated and saved successfully"
    })
  } catch (error) {
    console.error("Error generating custom slug:", error)
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    )
  }
}
