import { NextRequest } from 'next/server'
import { displayStyles, getDisplayStyle } from '@/lib/app-themes'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const themeId = searchParams.get('theme') || 'minimal'

  const theme = getDisplayStyle(themeId)

  // Mock data for demo
  const demoData = {
    currentTrack: {
  name: "T.N.T",
  artist: "AC/DC",
  album: "High Voltage",
  albumArt: "https://i.scdn.co/image/ab67616d0000b273286a0837ff3424065a735e0a",
  duration: 200000,
  progress: 120000,
  isPlaying: true,
      url: "https://open.spotify.com/track/0VjIjW4GlUK7FiH3cxQS5x"
    },
    recentTracks: [
      {
  name: "T.N.T",
  artist: "AC/DC",
        played_at: "2024-01-01T12:00:00Z"
      },
      {
  name: "T.N.T",
  artist: "AC/DC",
        played_at: "2024-01-01T11:45:00Z"
      },
      {
  name: "T.N.T",
  artist: "AC/DC",
        played_at: "2024-01-01T11:30:00Z"
      },
      {
  name: "T.N.T",
  artist: "AC/DC",
        played_at: "2024-01-01T11:15:00Z"
      },
      {
  name: "T.N.T",
  artist: "AC/DC",
        played_at: "2024-01-01T11:00:00Z"
      }
    ],
    settings: {
      showCurrentTrack: true,
      showRecentTracks: true,
      showArtist: true,
      showAlbum: true,
      showDuration: true,
      showProgress: true,
      showCredits: false,
      numberOfRecentTracks: 5
    },
    user: {
      name: "Demo User",
      customSlug: "demo-user"
    },
    theme: theme.id,
    customCSS: theme.customCSS || '',
    lastUpdated: new Date().toISOString()
  }

  // Generate HTML with the selected theme - DISPLAY PAGE LAYOUT
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Demo - ${theme.name} | JamLog</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1DB954"/>
            <stop offset="100%" style="stop-color:#1ed760"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
        <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
        <path d="M12 14 L20 14 M16 10 L16 22" stroke="black" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}" />
    <link rel="apple-touch-icon" href="data:image/svg+xml,${encodeURIComponent(`
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1DB954"/>
            <stop offset="100%" style="stop-color:#1ed760"/>
          </linearGradient>
        </defs>
        <rect width="180" height="180" rx="40" fill="url(#gradient)"/>
        <circle cx="90" cy="90" r="45" fill="white" opacity="0.9"/>
        <path d="M65 80 L115 80 M90 55 L90 125" stroke="black" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `)}" />
    <link rel="manifest" href="/site.webmanifest">

    <!-- Meta tags -->
    <meta name="description" content="Live preview of ${theme.name} theme for JamLog display">
    <meta name="theme-color" content="#000000">

    <!-- External resources -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        ${theme.customCSS || ''}
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            padding-top: 60px;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        /* Navigation header styles */
        .demo-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0.75rem 1rem;
        }

        .demo-header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .demo-logo {
            color: white;
            font-weight: 600;
            font-size: 1.125rem;
            text-decoration: none;
        }

        .demo-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
        }

        .demo-badge {
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        .close-demo {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: all 0.2s;
        }

        .close-demo:hover {
            color: white;
            background: rgba(255, 255, 255, 0.1);
    </style>
</head>
<body>

    <div class="min-h-screen ${theme.styles.background} ${theme.styles.fontFamily} flex items-center justify-center p-4">
        <!-- Custom background animations/effects -->
        ${theme.customCSS?.includes('scan-lines') ? '<div class="scan-lines absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('matrix-rain') ? '<div class="matrix-rain absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('galaxy-stars') ? '<div class="galaxy-stars absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('wave-animation') ? '<div class="wave-animation absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('aurora-waves') ? '<div class="aurora-waves absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('cyber-grid') ? '<div class="cyber-grid absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('ice-crystal') ? '<div class="ice-crystal absolute inset-0"></div>' : ''}
        ${theme.customCSS?.includes('gold-shine') ? '<div class="gold-shine absolute inset-0"></div>' : ''}

        <!-- Display Page Layout - EXACTLY like the real display page -->
        <div class="w-full ${demoData.recentTracks && demoData.recentTracks.length > 0 ? 'max-w-6xl' : 'max-w-2xl'} ${theme.styles.shadow}">
            <div class="${demoData.recentTracks && demoData.recentTracks.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}">
                <!-- Main Track Display -->
                <div class="${demoData.recentTracks && demoData.recentTracks.length > 0 ? 'lg:col-span-2' : ''} ${theme.styles.cardBackground} ${theme.styles.cardBorder} ${theme.styles.shadow} ${theme.styles.borderRadius}">
                    <div class="p-8">
                        <!-- Vertical stacked layout - everything centered -->
                        <div class="flex flex-col items-center text-center space-y-6">
                            <!-- Album Art - Largest element at the top -->
                            <div class="relative">
                                <img src="${demoData.currentTrack.albumArt}" alt="${demoData.currentTrack.album} cover" width="240" height="240" class="rounded-xl shadow-xl">
                                ${demoData.currentTrack.isPlaying ? '<div class="absolute inset-0 rounded-xl border-3 border-primary animate-pulse"></div>' : ''}
                            </div>

                            <!-- Track Info - Stacked vertically below the image -->
                            <div class="w-full space-y-4 max-w-md">
                                <!-- Song Title - Directly under the image -->
                                <div>
                                    <h1 class="text-3xl font-bold ${theme.styles.text} ${theme.customCSS?.includes('glow-text') ? 'glow-text' : ''} ${theme.customCSS?.includes('retro-glow') ? 'retro-glow' : ''} ${theme.customCSS?.includes('cyber-glow') ? 'cyber-glow' : ''} ${theme.customCSS?.includes('matrix-text') ? 'matrix-text' : ''}">${demoData.currentTrack.name}</h1>
                                </div>

                                <!-- Artist - Under the song title -->
                                <div class="${theme.styles.secondaryText}">
                                    <p class="text-xl">${demoData.currentTrack.artist}</p>
                                </div>

                                <!-- Album - Under the artist -->
                                <div class="text-lg ${theme.styles.secondaryText}">
                                    <p>from <span class="font-medium">${demoData.currentTrack.album}</span></p>
                                </div>

                                <!-- Progress and Duration - Under everything else -->
                                <div class="space-y-3 w-full">
                                    <div class="w-full ${theme.styles.progressBackground} rounded-full h-2">
                                        <div class="${theme.styles.progressBar} h-2 rounded-full transition-all duration-1000 ease-linear" style="width: 60%;"></div>
                                    </div>
                                    <div class="flex items-center justify-between text-sm ${theme.styles.secondaryText}">
                                        <span>2:00</span>
                                        <div class="flex items-center space-x-1">
                                            <span>🕐</span>
                                            <span>3:20</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Status - At the bottom -->
                                <div class="flex flex-col items-center space-y-2 pt-2">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 rounded-full ${demoData.currentTrack.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
                                        <span class="text-sm font-medium ${theme.styles.secondaryText}">
                                            ${demoData.currentTrack.isPlaying ? 'Now Playing' : 'Recently Played'}
                                        </span>
                                    </div>
                                    <span class="text-xs ${theme.styles.secondaryText}">
                                        Updated ${new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Powered by - at the bottom -->
                        ${!demoData.recentTracks || demoData.recentTracks.length === 0 ? `
                        <div class="mt-6 pt-4 border-t text-center">
                            <p class="text-xs ${theme.styles.secondaryText}">
                                Powered by <span class="font-medium">JamLog</span>
                            </p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Recent Tracks Sidebar - only if there are recent tracks -->
                ${demoData.recentTracks && demoData.recentTracks.length > 0 ? `
                <div class="lg:col-span-1 ${theme.styles.cardBackground} ${theme.styles.cardBorder} ${theme.styles.shadow} ${theme.styles.borderRadius}">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4 flex items-center ${theme.styles.text}">
                            🕐 Recently Played
                        </h3>
                        <div class="space-y-3 max-h-[500px] overflow-y-auto">
                            ${demoData.recentTracks.map((track, index) => `
                                <div class="group ${theme.styles.hover} p-2 rounded-lg transition-colors">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-300">
                                            <div class="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium truncate text-sm leading-tight mb-1 ${theme.styles.text}">${track.name}</p>
                                            <p class="text-xs truncate mb-1 ${theme.styles.secondaryText}">${track.artist}</p>
                                            <div class="flex items-center justify-between">
                                                <p class="text-xs ${theme.styles.secondaryText}">
                                                    ${new Date(track.played_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Powered by - in sidebar when recent tracks exist -->
                        <div class="mt-4 pt-4 border-t text-center">
                            <p class="text-xs ${theme.styles.secondaryText}">
                                Powered by <span class="font-medium">JamLog</span>
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Theme Info Badge -->
        <div class="absolute top-4 right-4 ${theme.styles.cardBackground} ${theme.styles.cardBorder} ${theme.styles.borderRadius} px-4 py-2">
            <p class="${theme.styles.text} text-sm font-medium ${theme.styles.fontFamily}">${theme.name}</p>
            <p class="${theme.styles.secondaryText} text-xs ${theme.styles.fontFamily}">${theme.category} theme</p>
        </div>
    </div>

    <script>
        // Animate progress bar
        function animateProgress() {
            const progressBar = document.querySelector('[style*="width: 60%"]');
            if (progressBar) {
                let width = 60;
                setInterval(() => {
                    width += 0.1;
                    if (width > 100) width = 0;
                    progressBar.style.width = width + '%';
                }, 100);
            }
        }

        // Auto-refresh every 30 seconds to show "live" updates
        setTimeout(() => {
            window.location.reload();
        }, 30000);

        // Start animations
        animateProgress();
    </script>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
