import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { isProductionBlockedRoute, getClientIP, rateLimit, SECURITY_CONFIG, logSecurityEvent } from '@/lib/security'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Development logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Request URL:', request.url)
  }

  // Security headers for all responses
  const response = NextResponse.next()

  // Add comprehensive security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Block development/debug routes in production
  if (isProductionBlockedRoute(pathname)) {
    logSecurityEvent('BLOCKED_DEV_ROUTE', { pathname }, request)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const clientIP = getClientIP(request)

    // Different rate limits for different route types
    let rateLimit_applied = false
    let limit = SECURITY_CONFIG.RATE_LIMITS.RELAXED // Default

    // Strict rate limiting for sensitive user operations
    if (pathname.startsWith('/api/user/preferences') ||
        pathname.startsWith('/api/user/generate-slug') ||
        pathname.includes('delete') ||
        pathname.includes('admin')) {
      limit = SECURITY_CONFIG.RATE_LIMITS.STRICT
      rateLimit_applied = true
    }
    // Moderate rate limiting for other user operations
    else if (pathname.startsWith('/api/user/') ||
             pathname.startsWith('/api/auth/')) {
      limit = SECURITY_CONFIG.RATE_LIMITS.MODERATE
      rateLimit_applied = true
    }
    // Relaxed rate limiting for public display/stream endpoints
    else if (pathname.startsWith('/api/display/') ||
             pathname.startsWith('/api/stream/') ||
             pathname.startsWith('/api/public/')) {
      limit = SECURITY_CONFIG.RATE_LIMITS.RELAXED
      rateLimit_applied = true
    }

    if (rateLimit_applied && !rateLimit(clientIP, limit)) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { pathname, ip: clientIP }, request)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }
  }

  // Content Security Policy for pages (not API routes)
  if (!pathname.startsWith('/api/')) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://api.spotify.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https: wss: https://api.spotify.com https://accounts.spotify.com",
        "media-src 'self' https:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ')
    )
  }

  return response
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
