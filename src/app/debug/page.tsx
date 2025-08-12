'use client'

import { useSession } from "next-auth/react"
import { useState } from "react"

export default function DebugPage() {
  const { data: session } = useSession()
  const [debugInfo, setDebugInfo] = useState(null)
  const [cleanupResult, setCleanupResult] = useState(null)

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug/session-info')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error fetching debug info:', error)
    }
  }

  const cleanupPreferences = async () => {
    try {
      const response = await fetch('/api/admin/cleanup-user-prefs', {
        method: 'POST'
      })
      const data = await response.json()
      setCleanupResult(data)
      // Refresh debug info after cleanup
      fetchDebugInfo()
    } catch (error) {
      console.error('Error cleaning up preferences:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug User Preferences</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Client Session Info:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>
          <button
            onClick={fetchDebugInfo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Server Session Info
          </button>
          {debugInfo && (
            <div className="mt-2">
              <h3 className="font-semibold">Server Debug Info:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={cleanupPreferences}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cleanup Duplicate Preferences
          </button>
          {cleanupResult && (
            <div className="mt-2">
              <h3 className="font-semibold">Cleanup Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(cleanupResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
