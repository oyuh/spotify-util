export interface ThemeConfig {
  id: string
  name: string
  description: string
  preview: string // URL or color for preview
  styles: {
    background: string
    cardBackground: string
    cardBorder: string
    text: string
    secondaryText: string
    accent: string
    progressBar: string
    progressBackground: string
    shadow: string
    hover: string
  }
  customCSS?: string
}

export const displayThemes: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern default theme',
    preview: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    styles: {
      background: 'bg-gradient-to-br from-background to-muted/30',
      cardBackground: 'bg-background/80 backdrop-blur-xl',
      cardBorder: 'border border-border/40',
      text: 'text-foreground',
      secondaryText: 'text-muted-foreground',
      accent: 'text-primary',
      progressBar: 'bg-primary',
      progressBackground: 'bg-secondary',
      shadow: 'shadow-lg',
      hover: 'hover:bg-muted/50'
    }
  },
  {
    id: 'spotify-green',
    name: 'Spotify Classic',
    description: 'Official Spotify green theme',
    preview: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
    styles: {
      background: 'bg-gradient-to-br from-black to-gray-900',
      cardBackground: 'bg-gray-900/90 backdrop-blur-xl',
      cardBorder: 'border border-green-500/30',
      text: 'text-white',
      secondaryText: 'text-gray-300',
      accent: 'text-green-400',
      progressBar: 'bg-green-500',
      progressBackground: 'bg-gray-700',
      shadow: 'shadow-xl shadow-green-500/20',
      hover: 'hover:bg-gray-800/50'
    }
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    description: 'Cyberpunk-inspired purple neon theme',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    styles: {
      background: 'bg-gradient-to-br from-purple-950 via-black to-pink-950',
      cardBackground: 'bg-purple-900/20 backdrop-blur-xl',
      cardBorder: 'border border-purple-500/50',
      text: 'text-purple-100',
      secondaryText: 'text-purple-300',
      accent: 'text-pink-400',
      progressBar: 'bg-gradient-to-r from-purple-500 to-pink-500',
      progressBackground: 'bg-purple-900/50',
      shadow: 'shadow-2xl shadow-purple-500/30',
      hover: 'hover:bg-purple-800/30'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calming ocean-inspired blue theme',
    preview: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    styles: {
      background: 'bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950',
      cardBackground: 'bg-blue-900/30 backdrop-blur-xl',
      cardBorder: 'border border-cyan-500/40',
      text: 'text-cyan-50',
      secondaryText: 'text-cyan-200',
      accent: 'text-cyan-400',
      progressBar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
      progressBackground: 'bg-slate-700',
      shadow: 'shadow-xl shadow-cyan-500/20',
      hover: 'hover:bg-cyan-800/20'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm sunset-inspired orange theme',
    preview: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    styles: {
      background: 'bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950',
      cardBackground: 'bg-orange-900/25 backdrop-blur-xl',
      cardBorder: 'border border-orange-500/40',
      text: 'text-orange-50',
      secondaryText: 'text-orange-200',
      accent: 'text-yellow-400',
      progressBar: 'bg-gradient-to-r from-orange-500 to-red-500',
      progressBackground: 'bg-orange-900/50',
      shadow: 'shadow-xl shadow-orange-500/25',
      hover: 'hover:bg-orange-800/25'
    }
  },
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave',
    description: '80s synthwave aesthetic',
    preview: 'linear-gradient(135deg, #FF0080 0%, #7928CA 50%, #FF8A00 100%)',
    styles: {
      background: 'bg-gradient-to-br from-violet-950 via-fuchsia-950 to-purple-950',
      cardBackground: 'bg-gradient-to-br from-fuchsia-900/20 to-violet-900/20 backdrop-blur-xl',
      cardBorder: 'border border-fuchsia-500/60 shadow-lg shadow-fuchsia-500/30',
      text: 'text-fuchsia-100',
      secondaryText: 'text-fuchsia-300',
      accent: 'text-yellow-400',
      progressBar: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400',
      progressBackground: 'bg-purple-900/60',
      shadow: 'shadow-2xl shadow-fuchsia-500/40',
      hover: 'hover:bg-fuchsia-800/30'
    },
    customCSS: `
      .synthwave-glow {
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
        border: 1px solid #ec4899;
      }
      .synthwave-text {
        text-shadow: 0 0 10px rgba(236, 72, 153, 0.8);
      }
    `
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean minimal white theme',
    preview: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    styles: {
      background: 'bg-gradient-to-br from-white to-gray-50',
      cardBackground: 'bg-white/90 backdrop-blur-sm',
      cardBorder: 'border border-gray-200',
      text: 'text-gray-900',
      secondaryText: 'text-gray-600',
      accent: 'text-blue-600',
      progressBar: 'bg-blue-500',
      progressBackground: 'bg-gray-200',
      shadow: 'shadow-lg',
      hover: 'hover:bg-gray-50'
    }
  },
  {
    id: 'dark-red',
    name: 'Dark Red',
    description: 'Bold dark red theme',
    preview: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    styles: {
      background: 'bg-gradient-to-br from-red-950 via-black to-gray-900',
      cardBackground: 'bg-red-900/20 backdrop-blur-xl',
      cardBorder: 'border border-red-500/40',
      text: 'text-red-50',
      secondaryText: 'text-red-200',
      accent: 'text-red-400',
      progressBar: 'bg-gradient-to-r from-red-600 to-red-500',
      progressBackground: 'bg-red-900/50',
      shadow: 'shadow-xl shadow-red-500/20',
      hover: 'hover:bg-red-800/25'
    }
  }
]

export const streamThemes: ThemeConfig[] = [
  {
    id: 'transparent',
    name: 'Transparent',
    description: 'Minimal transparent overlay for streaming',
    preview: 'rgba(0, 0, 0, 0.1)',
    styles: {
      background: 'bg-transparent',
      cardBackground: 'bg-black/80 backdrop-blur-md',
      cardBorder: 'border-0',
      text: 'text-white',
      secondaryText: 'text-gray-300',
      accent: 'text-green-400',
      progressBar: 'bg-green-500',
      progressBackground: 'bg-gray-600',
      shadow: 'shadow-2xl',
      hover: 'hover:bg-black/90'
    }
  },
  {
    id: 'stream-green',
    name: 'Stream Green',
    description: 'Streaming-optimized green theme',
    preview: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    styles: {
      background: 'bg-transparent',
      cardBackground: 'bg-emerald-900/90 backdrop-blur-lg',
      cardBorder: 'border border-emerald-400/50',
      text: 'text-emerald-100',
      secondaryText: 'text-emerald-300',
      accent: 'text-emerald-400',
      progressBar: 'bg-emerald-400',
      progressBackground: 'bg-emerald-800',
      shadow: 'shadow-xl shadow-emerald-500/30',
      hover: 'hover:bg-emerald-800/80'
    }
  },
  {
    id: 'stream-minimal',
    name: 'Stream Minimal',
    description: 'Ultra-minimal for clean overlays',
    preview: 'rgba(255, 255, 255, 0.95)',
    styles: {
      background: 'bg-transparent',
      cardBackground: 'bg-white/95 backdrop-blur-sm',
      cardBorder: 'border-0',
      text: 'text-gray-900',
      secondaryText: 'text-gray-600',
      accent: 'text-blue-600',
      progressBar: 'bg-blue-500',
      progressBackground: 'bg-gray-300',
      shadow: 'shadow-lg',
      hover: 'hover:bg-white'
    }
  },
  {
    id: 'stream-neon',
    name: 'Stream Neon',
    description: 'Eye-catching neon for gaming streams',
    preview: 'linear-gradient(135deg, #00F5FF 0%, #FF1493 100%)',
    styles: {
      background: 'bg-transparent',
      cardBackground: 'bg-black/85 backdrop-blur-lg',
      cardBorder: 'border border-cyan-400 shadow-lg shadow-cyan-400/50',
      text: 'text-cyan-100',
      secondaryText: 'text-cyan-300',
      accent: 'text-pink-400',
      progressBar: 'bg-gradient-to-r from-cyan-400 to-pink-400',
      progressBackground: 'bg-gray-800',
      shadow: 'shadow-2xl shadow-cyan-400/30',
      hover: 'hover:bg-black/95'
    },
    customCSS: `
      .neon-glow {
        box-shadow: 0 0 15px rgba(0, 245, 255, 0.6), 0 0 30px rgba(255, 20, 147, 0.4);
        animation: neon-pulse 2s ease-in-out infinite alternate;
      }
      @keyframes neon-pulse {
        from { box-shadow: 0 0 15px rgba(0, 245, 255, 0.6), 0 0 30px rgba(255, 20, 147, 0.4); }
        to { box-shadow: 0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(255, 20, 147, 0.6); }
      }
    `
  }
]

export function getTheme(themeId: string, type: 'display' | 'stream'): ThemeConfig {
  const themes = type === 'display' ? displayThemes : streamThemes
  return themes.find(theme => theme.id === themeId) || themes[0]
}

export function applyThemeStyles(theme: ThemeConfig): string {
  let css = ''

  if (theme.customCSS) {
    css += theme.customCSS
  }

  // Add any additional dynamic CSS generation here
  return css
}

// Theme utility functions
export function getThemesList(type: 'display' | 'stream') {
  return type === 'display' ? displayThemes : streamThemes
}

export function isValidTheme(themeId: string, type: 'display' | 'stream'): boolean {
  const themes = getThemesList(type)
  return themes.some(theme => theme.id === themeId)
}
