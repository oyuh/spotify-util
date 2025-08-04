import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log('Middleware - Request URL:', request.url)
  console.log('Middleware - Cookies:', request.cookies.getAll().map(c => c.name))

  // Block dev routes in production
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/api/dev/')) {
    console.log('Middleware - Blocking dev route in production:', request.nextUrl.pathname)
    return new NextResponse(
      JSON.stringify({ error: 'Development endpoints not available in production' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
