import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    // Try multiple ways to get the session
    const session = await getServerSession(authOptions)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    console.log('Session test - session:', session)
    console.log('Session test - token:', token)

    // Get all cookies
    const cookies = request.cookies.getAll()
    console.log('Session test - cookies:', cookies)

    // Check for specific NextAuth cookies
    const sessionCookie = request.cookies.get('__Secure-next-auth.session-token') ||
                         request.cookies.get('next-auth.session-token')

    return NextResponse.json({
      session,
      token,
      cookies,
      sessionCookie: sessionCookie?.value ? 'Present' : 'Missing',
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
      },
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
      }
    })
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
