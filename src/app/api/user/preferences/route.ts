import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserPreferences, updateUserPreferences, createDefaultUserPreferences } from "@/lib/db"
import { generateCustomSlug, isValidSlug } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
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
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Settings POST - Session:", { userId: session?.userId, spotifyId: session?.spotifyId })

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Settings POST - Request body:", JSON.stringify(body, null, 2))

    // Validate custom slug if provided
    if (body.privacySettings?.customSlug) {
      const slug = body.privacySettings.customSlug
      if (!isValidSlug(slug)) {
        return NextResponse.json(
          { error: "Invalid custom slug format" },
          { status: 400 }
        )
      }
    }

    // Generate a new custom slug if user wants one but didn't provide
    if (body.privacySettings?.isPublic && !body.privacySettings?.customSlug) {
      body.privacySettings.customSlug = generateCustomSlug()
    }

    console.log("Settings POST - About to update preferences for userId:", session.userId)
    await updateUserPreferences(session.userId, body)
    console.log("Settings POST - Successfully updated preferences")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}
