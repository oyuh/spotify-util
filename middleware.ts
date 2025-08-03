import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/login",
          "/api/auth",
          "/api/public",
          "/display", // Public display routes
          "/stream", // Public streaming routes
        ]

        // Check if the current path is a public route
        const isPublicRoute = publicRoutes.some(route =>
          pathname.startsWith(route)
        )

        // Allow public routes without authentication
        if (isPublicRoute) {
          return true
        }

        // For protected routes, require a token
        return !!token
      },
    },
  }
)

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
