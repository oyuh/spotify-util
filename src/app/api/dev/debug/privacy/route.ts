import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserPreferences } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userPrefs = await getUserPreferences(session.user.id)

    return NextResponse.json({
      userId: session.user.id,
      userPreferences: userPrefs,
      privacySettings: userPrefs?.privacySettings,
      isPublic: userPrefs?.privacySettings?.isPublic,
      customSlug: userPrefs?.privacySettings?.customSlug,
      debugInfo: {
        hasPreferences: !!userPrefs,
        hasPrivacySettings: !!userPrefs?.privacySettings,
        privacySettingsType: typeof userPrefs?.privacySettings?.isPublic
      }
    })
  } catch (error) {
    console.error("Privacy debug error:", error)
    return NextResponse.json({ error: "Failed to debug privacy" }, { status: 500 })
  }
}
