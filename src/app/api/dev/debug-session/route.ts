import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log('Debug session endpoint called')
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))

  const session = await getServerSession(authOptions)

  console.log('Session from getServerSession:', session)

  // Also check environment variables
  const envCheck = {
    hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasMongoUri: !!process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    vercelUrl: process.env.VERCEL_URL,
  }

  return NextResponse.json({
    session,
    envCheck,
    timestamp: new Date().toISOString(),
    requestUrl: request.url,
    cookies: request.cookies.getAll(),
  })
}
