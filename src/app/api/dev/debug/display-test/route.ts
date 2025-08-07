import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Use a valid identifier from the URL parameters or default test
    const url = new URL(request.url)
    const testIdentifier = url.searchParams.get('id') || 'wthlaw'

    console.log('🔍 Debug: Testing background image for identifier:', testIdentifier)

    // Try slug endpoint first - use proper Next.js API route
    const baseUrl = process.env.NEXTAUTH_URL || `${url.protocol}//${url.host}`
    const response = await fetch(`${baseUrl}/api/public/display/${testIdentifier}`)
    console.log('🔍 Debug: API response status:', response.status)

    if (response.ok) {
      const userData = await response.json()
      console.log('🔍 Debug: Background image URL:', userData.preferences?.displaySettings?.backgroundImage)

      return NextResponse.json({
        identifier: testIdentifier,
        status: response.status,
        hasPreferences: !!userData.preferences,
        hasDisplaySettings: !!userData.preferences?.displaySettings,
        styleValue: userData.preferences?.displaySettings?.style,
        backgroundImage: userData.preferences?.displaySettings?.backgroundImage,
        fullPreferences: userData.preferences
      })
    } else {
      // Try the other endpoint format
      const response2 = await fetch(`${baseUrl}/api/display/${testIdentifier}`)
      console.log('🔍 Debug: Second API response status:', response2.status)

      if (response2.ok) {
        const userData = await response2.json()
        return NextResponse.json({
          identifier: testIdentifier,
          status: response2.status,
          endpoint: 'display',
          hasPreferences: !!userData.preferences,
          hasDisplaySettings: !!userData.preferences?.displaySettings,
          styleValue: userData.preferences?.displaySettings?.style,
          backgroundImage: userData.preferences?.displaySettings?.backgroundImage,
          fullPreferences: userData.preferences
        })
      } else {
        return NextResponse.json({
          identifier: testIdentifier,
          status: response.status,
          status2: response2.status,
          error: 'Both API endpoints failed'
        })
      }
    }
  } catch (error) {
    console.error('🔍 Debug: Error:', error)
    return NextResponse.json({
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
