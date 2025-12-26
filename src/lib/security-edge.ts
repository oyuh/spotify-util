import { NextRequest } from 'next/server'

// Rate limiting storage (best-effort; resets per edge instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const SECURITY_CONFIG = {
  RATE_LIMITS: {
    STRICT: { requests: 10, windowMs: 60000 },
    MODERATE: { requests: 60, windowMs: 60000 },
    RELAXED: { requests: 100, windowMs: 60000 },
  },
  PRODUCTION_ONLY_ROUTES: ['/api/dev', '/api/test', '/api/debug'],
} as const

export function rateLimit(
  identifier: string,
  limit: { requests: number; windowMs: number }
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (record && now > record.resetTime) {
    rateLimitMap.delete(identifier)
  }

  const currentRecord =
    rateLimitMap.get(identifier) || { count: 0, resetTime: now + limit.windowMs }

  if (currentRecord.count >= limit.requests) {
    return false
  }

  currentRecord.count++
  rateLimitMap.set(identifier, currentRecord)
  return true
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  if (realIp) return realIp
  if (cfConnectingIp) return cfConnectingIp

  // Edge-safe fallback identifier (no Buffer)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  return `fallback-${userAgent.slice(0, 32)}-${acceptLanguage.slice(0, 16)}`
}

export function isProductionBlockedRoute(pathname: string): boolean {
  if (process.env.NODE_ENV !== 'production') return false
  return SECURITY_CONFIG.PRODUCTION_ONLY_ROUTES.some((route) => pathname.startsWith(route))
}

export function logSecurityEvent(event: string, details: any, request?: NextRequest) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request ? getClientIP(request) : 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('SECURITY EVENT:', JSON.stringify(logData))
  } else {
    console.log('Security Event:', logData)
  }
}
