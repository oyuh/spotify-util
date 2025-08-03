import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateCustomSlug } from "@/lib/utils"
import { getUserBySlug } from "@/lib/db"

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

    return NextResponse.json({ slug })
  } catch (error) {
    console.error("Error generating custom slug:", error)
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    )
  }
}
