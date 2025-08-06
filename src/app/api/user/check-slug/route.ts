import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { isSlugTaken } from "@/lib/db"
import { isValidSlug } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { slug } = body

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Validate slug format
    if (!isValidSlug(slug)) {
      return NextResponse.json({
        available: false,
        error: "Invalid slug format. Use only lowercase letters, numbers, and hyphens (3-30 characters)."
      }, { status: 200 })
    }

    // Check if slug is taken by another user
    const taken = await isSlugTaken(slug, session.userId)

    return NextResponse.json({
      available: !taken,
      slug: slug
    })
  } catch (error) {
    console.error("Error checking slug availability:", error)
    return NextResponse.json(
      { error: "Failed to check slug availability" },
      { status: 500 }
    )
  }
}
