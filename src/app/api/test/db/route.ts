import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Test database connection
    await db.admin().ping()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
