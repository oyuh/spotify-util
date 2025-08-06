import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Test if we can reach Spotify's OAuth endpoint
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: 'user-read-email user-read-private',
    redirect_uri: 'https://jamlog.live/api/auth/callback/spotify',
    state: 'test-state-123'
  })}`

  return NextResponse.json({
    message: "Spotify OAuth Test",
    config: {
      hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: 'https://jamlog.live/api/auth/callback/spotify',
    },
    testAuthUrl: spotifyAuthUrl,
    instructions: [
      "1. Copy the testAuthUrl above",
      "2. Paste it in a new browser tab",
      "3. If you get a Spotify login page, your Spotify app config is correct",
      "4. If you get a redirect_uri_mismatch error, fix your Spotify app settings"
    ]
  })
}
