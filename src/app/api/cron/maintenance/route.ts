import { NextRequest, NextResponse } from 'next/server'

// Verify request is from authorized source
function isAuthorizedCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here'
  const userAgent = request.headers.get('user-agent') || ''

  // Check for authorization header OR cron-job.org user agent pattern
  const hasValidAuth = authHeader === `Bearer ${cronSecret}`
  const isCronJobOrg = userAgent.includes('cron-job.org') || userAgent.includes('cronjob')

  // For cron-job.org, also check for secret in query params as backup
  const urlSecret = new URL(request.url).searchParams.get('secret')
  const hasValidUrlSecret = urlSecret === cronSecret

  return hasValidAuth || (isCronJobOrg && hasValidUrlSecret)
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    if (!isAuthorizedCronRequest(request)) {
      console.log('Unauthorized cron request:', {
        userAgent: request.headers.get('user-agent'),
        hasAuth: !!request.headers.get('authorization'),
        hasSecret: !!new URL(request.url).searchParams.get('secret')
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🤖 Cron job triggered:', new Date().toISOString())

    // Call the maintenance endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/admin/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Cron-Job'
      },
      body: JSON.stringify({})
    })

    const result = await response.json()

    console.log('🎯 Cron maintenance completed:', {
      success: result.success,
      tasksExecuted: result.results?.tasksExecuted?.length || 0,
      errors: result.results?.errors?.length || 0
    })

    return NextResponse.json({
      success: true,
      cronExecuted: true,
      timestamp: new Date().toISOString(),
      maintenanceResult: result,
      message: 'Cron job executed successfully'
    })

  } catch (error) {
    console.error('❌ Cron job error:', error)
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    message: 'Cron endpoint is working',
    timestamp: new Date().toISOString(),
    nextMaintenanceWillRun: 'When called via POST'
  })
}
