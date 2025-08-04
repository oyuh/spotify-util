import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Public test route working", timestamp: new Date().toISOString() })
}
