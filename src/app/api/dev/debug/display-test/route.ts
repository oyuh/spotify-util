import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate what the display page does
    const identifier = 'MIMzEBbN4TrV'
    console.log('🔍 Debug: Fetching style for identifier:', identifier)

    // Try slug endpoint first
    const response = await fetch(`http://localhost:3000/api/public/display/${identifier}`)
    console.log('🔍 Debug: API response status:', response.status)

    if (response.ok) {
      const userData = await response.json()
      console.log('🔍 Debug: API response has preferences:', !!userData.preferences)
      console.log('🔍 Debug: API response has displaySettings:', !!userData.preferences?.displaySettings)
      console.log('🔍 Debug: API response style value:', userData.preferences?.displaySettings?.style)

      return NextResponse.json({
        identifier,
        status: response.status,
        hasPreferences: !!userData.preferences,
        hasDisplaySettings: !!userData.preferences?.displaySettings,
        styleValue: userData.preferences?.displaySettings?.style,
        fullPreferences: userData.preferences
      })
    } else {
      return NextResponse.json({
        identifier,
        status: response.status,
        error: 'API call failed'
      })
    }
  } catch (error) {
    console.error('🔍 Debug: Error:', error)
    return NextResponse.json({
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
