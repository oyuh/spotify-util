import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMITS: {
    STRICT: { requests: 10, windowMs: 60000 }, // 10 requests per minute
    MODERATE: { requests: 60, windowMs: 60000 }, // 60 requests per minute
    RELAXED: { requests: 100, windowMs: 60000 }, // 100 requests per minute
  },

  // Environment checks
  PRODUCTION_ONLY_ROUTES: [
    '/api/dev',
    '/api/test',
    '/api/debug',
  ],

  // Auth required routes
  PROTECTED_ROUTES: [
    '/api/user',
    '/api/analytics',
  ],

  // Public routes (no auth required but may have rate limits)
  PUBLIC_ROUTES: [
    '/api/display',
    '/api/stream',
    '/api/public',
  ]
}

// Rate limiting function
export function rateLimit(identifier: string, limit: { requests: number; windowMs: number }): boolean {
  const now = Date.now()
  const key = identifier
  const record = rateLimitMap.get(key)

  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitMap.delete(key)
  }

  // Get current record or create new one
  const currentRecord = rateLimitMap.get(key) || { count: 0, resetTime: now + limit.windowMs }

  // Check if limit exceeded
  if (currentRecord.count >= limit.requests) {
    return false
  }

  // Increment counter
  currentRecord.count++
  rateLimitMap.set(key, currentRecord)

  return true
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  // Check various headers for real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to a hash of user-agent + other headers for identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  return `fallback-${Buffer.from(userAgent + acceptLanguage).toString('base64').substring(0, 10)}`
}

// Check if route should be blocked in production
export function isProductionBlockedRoute(pathname: string): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  return SECURITY_CONFIG.PRODUCTION_ONLY_ROUTES.some(route =>
    pathname.startsWith(route)
  )
}

// Security middleware for API routes
export async function securityMiddleware(
  request: NextRequest,
  options: {
    requireAuth?: boolean
    rateLimit?: 'STRICT' | 'MODERATE' | 'RELAXED'
    allowInProduction?: boolean
  } = {}
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname

  // Block development/debug routes in production
  if (!options.allowInProduction && isProductionBlockedRoute(pathname)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Rate limiting
  if (options.rateLimit) {
    const clientIP = getClientIP(request)
    const limit = SECURITY_CONFIG.RATE_LIMITS[options.rateLimit]

    if (!rateLimit(clientIP, limit)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      )
    }
  }

  // Authentication check
  if (options.requireAuth) {
    const session = await getServerSession(authOptions)
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return null // No blocking response, continue processing
}

// Input validation helpers
export function validateString(value: unknown, minLength = 0, maxLength = 1000): string | null {
  if (typeof value !== 'string') return null
  if (value.length < minLength || value.length > maxLength) return null
  return value
}

export function validateNumber(value: unknown, min?: number, max?: number): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (typeof num !== 'number' || isNaN(num)) return null
  if (min !== undefined && num < min) return null
  if (max !== undefined && num > max) return null
  return num
}

export function validateBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

// SQL Injection prevention (for query strings)
export function sanitizeInput(input: string): string {
  return input
    .replace(/['"\\;]/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 1000) // Limit length
}

// XSS prevention for HTML content
export function sanitizeHTML(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate MongoDB ObjectId format
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Enhanced CSS sanitization
export function sanitizeCSS(css: string): string {
  // Remove potentially dangerous CSS properties and functions
  const dangerousPatterns = [
    /javascript\s*:/gi,
    /expression\s*\(/gi,
    /@import\s+/gi,
    /behavior\s*:/gi,
    /-moz-binding\s*:/gi,
    /content\s*:\s*url\s*\(/gi,
    /url\s*\(\s*javascript\s*:/gi,
    /<script/gi,
    /<\/script/gi,
    /on\w+\s*=/gi, // event handlers
    /data\s*:\s*text\/html/gi,
  ]

  let sanitized = css
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  // Limit CSS length to prevent DoS
  if (sanitized.length > 50000) {
    sanitized = sanitized.substring(0, 50000)
  }

  return sanitized
}

// Log security events
export function logSecurityEvent(event: string, details: any, request?: NextRequest) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request ? getClientIP(request) : 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown'
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    console.warn('SECURITY EVENT:', JSON.stringify(logData))
    // TODO: Send to monitoring service (e.g., Sentry, LogRocket, etc.)
  } else {
    console.log('Security Event:', logData)
  }
}
