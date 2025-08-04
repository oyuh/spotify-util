import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const realUserId = "688ed27e187701251fe296a7"  // Your actual login user ID
    const wrongUserId = "688ebe078be59f856ce1882c"  // Wrong user ID with the tokens

    // Step 1: Get the good user preferences (the one with the working slug)
    const goodUserPrefs = await db.collection("user_preferences").findOne({
      userId: wrongUserId
    })

    // Step 2: Update the account to point to your real user ID
    const updateAccountResult = await db.collection("accounts").updateOne(
      { userId: new ObjectId(wrongUserId) },
      { $set: { userId: new ObjectId(realUserId) } }
    )

    // Step 3: Transfer the good preferences to your real user ID
    if (goodUserPrefs) {
      await db.collection("user_preferences").updateOne(
        { userId: realUserId },
        {
          $set: {
            ...goodUserPrefs,
            userId: realUserId,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
    }

    // Step 4: Delete the wrong user record
    const deleteResult = await db.collection("user_preferences").deleteOne({
      userId: wrongUserId
    })

    // Verify the fix
    const finalAccount = await db.collection("accounts").findOne({
      provider: "spotify",
      providerAccountId: "lawsonhart"
    })

    const finalUser = await db.collection("user_preferences").findOne({
      userId: realUserId
    })

    return NextResponse.json({
      success: true,
      message: "Fixed user ID mismatch - moved account tokens to your real user ID",
      actions: {
        updatedAccount: updateAccountResult.modifiedCount > 0,
        transferredPreferences: !!goodUserPrefs,
        deletedWrongUser: deleteResult.deletedCount > 0
      },
      verification: {
        accountNowPointsTo: finalAccount?.userId?.toString(),
        userPrefsExist: !!finalUser,
        customSlug: finalUser?.privacySettings?.customSlug
      }
    })
  } catch (error) {
    console.error("Error fixing user ID mismatch:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
