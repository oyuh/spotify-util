import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)

  // Get all cookies
  const cookies = request.cookies.getAll()

  // Look for NextAuth cookies specifically
  const authCookies = cookies.filter(cookie =>
    cookie.name.includes('next-auth') ||
    cookie.name.includes('__Secure-next-auth') ||
    cookie.name.includes('__Host-next-auth')
  )

  return NextResponse.json({
    currentUrl: request.url,
    host: request.headers.get('host'),
    allCookies: cookies,
    authCookies,
    cookieCount: cookies.length,
    authCookieCount: authCookies.length,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    headers: {
      'user-agent': request.headers.get('user-agent'),
      'referer': request.headers.get('referer'),
      'origin': request.headers.get('origin'),
    }
  })
}
