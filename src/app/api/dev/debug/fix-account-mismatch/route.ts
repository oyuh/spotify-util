import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const realUserId = "688ed27e187701251fe296a7"  // Your actual login user ID
    const wrongUserId = "688ebe078be59f856ce1882c"  // Wrong user ID with the tokens

    // Step 1: Get the account data from the wrong user
    const wrongAccount = await db.collection("accounts").findOne({
      userId: new ObjectId(wrongUserId),
      provider: "spotify"
    })

    if (!wrongAccount) {
      return NextResponse.json({ error: "No account found to transfer" }, { status: 404 })
    }

    // Step 2: Check if an account already exists for your real user ID
    const existingAccount = await db.collection("accounts").findOne({
      userId: new ObjectId(realUserId),
      provider: "spotify"
    })

    if (existingAccount) {
      // Just update the existing account
      const updateResult = await db.collection("accounts").updateOne(
        { userId: new ObjectId(realUserId), provider: "spotify" },
        {
          $set: {
            access_token: wrongAccount.access_token,
            refresh_token: wrongAccount.refresh_token,
            expires_at: wrongAccount.expires_at,
            token_type: wrongAccount.token_type,
            scope: wrongAccount.scope
          }
        }
      )

      console.log("Updated existing account for real user ID")
    } else {
      // Create new account for your real user ID
      const newAccount = {
        ...wrongAccount,
        _id: undefined, // Remove the old _id to let MongoDB create a new one
        userId: new ObjectId(realUserId)
      }
      delete newAccount._id // Make sure it's removed

      const insertResult = await db.collection("accounts").insertOne(newAccount)
      console.log("Created new account for real user ID")
    }

    // Step 3: Delete the wrong account
    const deleteResult = await db.collection("accounts").deleteOne({
      userId: new ObjectId(wrongUserId),
      provider: "spotify"
    })

    // Step 4: Delete the wrong user preferences
    const deleteUserResult = await db.collection("user_preferences").deleteOne({
      userId: wrongUserId
    })

    return NextResponse.json({
      success: true,
      message: "Fixed account mismatch - moved Spotify tokens to your real user ID",
      actions: {
        accountTransferred: true,
        deletedWrongAccount: deleteResult.deletedCount > 0,
        deletedWrongUser: deleteUserResult.deletedCount > 0
      },
      realUserId,
      wrongUserId
    })
  } catch (error) {
    console.error("Error fixing account mismatch:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
