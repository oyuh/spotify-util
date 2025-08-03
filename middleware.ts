import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// Temporarily disable withAuth middleware to debug session issues
export function middleware(request: NextRequest) {
  console.log('Middleware - Request URL:', request.url)
  console.log('Middleware - Cookies:', request.cookies.getAll().map(c => c.name))
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
