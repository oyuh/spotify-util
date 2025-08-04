import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { generateCustomSlug } from "@/lib/utils"
import { getUserBySlug } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const realUserId = "688ed27e187701251fe296a7"  // Your actual login user ID
    const wrongUserId = "688ebe078be59f856ce1882c"  // Wrong user ID to delete

    // Step 1: Generate a unique slug for your real user
    let slug: string
    let attempts = 0
    const maxAttempts = 10

    do {
      slug = generateCustomSlug()
      const existingUser = await getUserBySlug(slug)
      if (!existingUser) break
      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: "Failed to generate unique slug" }, { status: 500 })
    }

    // Step 2: Update your real user with the new slug
    const updateResult = await db.collection("user_preferences").updateOne(
      { userId: realUserId },
      {
        $set: {
          "privacySettings.customSlug": slug,
          "privacySettings.isPublic": false,
          "privacySettings.hideSpotifyId": true,
          updatedAt: new Date()
        }
      }
    )

    // Step 3: Delete the wrong/duplicate user
    const deleteResult = await db.collection("user_preferences").deleteOne({
      userId: wrongUserId
    })

    return NextResponse.json({
      success: true,
      message: "Fixed user data - generated new slug for your real user ID and deleted duplicate",
      actions: {
        generatedSlug: slug,
        updatedRealUser: updateResult.modifiedCount > 0,
        deletedDuplicateUser: deleteResult.deletedCount > 0
      },
      realUserId,
      newSlug: slug,
      deletedUserId: wrongUserId
    })
  } catch (error) {
    console.error("Error fixing user data:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
