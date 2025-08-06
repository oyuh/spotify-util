import { Music } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,255,100,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-800 border-t-green-400 mx-auto"></div>
          <Music className="absolute inset-0 m-auto h-12 w-12 text-green-400 animate-pulse" />
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Loading JamLog
          </span>
        </h2>

        <p className="text-gray-400 mb-8">
          Preparing your music experience...
        </p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
