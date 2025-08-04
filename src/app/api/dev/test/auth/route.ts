import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  return NextResponse.json({
    message: "Auth test endpoint",
    baseUrl,
    expectedCallbackUrl: `${baseUrl}/api/auth/callback/spotify`,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    },
    headers: Object.fromEntries(request.headers.entries()),
  })
}
