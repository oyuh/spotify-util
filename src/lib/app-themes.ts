// App-wide themes for dashboard, header, settings, etc.
export interface AppTheme {
  id: string
  name: string
  description: string
  preview: string
  variables: {
    // CSS custom properties for the app interface
    '--background': string
    '--foreground': string
    '--card': string
    '--card-foreground': string
    '--popover': string
    '--popover-foreground': string
    '--primary': string
    '--primary-foreground': string
    '--secondary': string
    '--secondary-foreground': string
    '--muted': string
    '--muted-foreground': string
    '--accent': string
    '--accent-foreground': string
    '--destructive': string
    '--destructive-foreground': string
    '--border': string
    '--input': string
    '--ring': string
    '--sidebar': string
    '--sidebar-foreground': string
    '--sidebar-primary': string
    '--sidebar-primary-foreground': string
    '--sidebar-accent': string
    '--sidebar-accent-foreground': string
    '--sidebar-border': string
    '--sidebar-ring': string
    '--chart-1': string
    '--chart-2': string
    '--chart-3': string
    '--chart-4': string
    '--chart-5': string
  }
}

// Display styles for public music displays
export interface DisplayStyle {
  id: string
  name: string
  description: string
  preview: string
  category: 'minimal' | 'modern' | 'retro' | 'neon' | 'spotify' | 'custom' | 'nature' | 'gaming'
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
    fontFamily?: string
    fontSize?: string
    borderRadius?: string
  }
  customCSS?: string
  backgroundImage?: string
}

// App themes for dashboard/interface
export const appThemes: AppTheme[] = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme',
    preview: '#09090b',
    variables: {
      '--background': '0 0% 3.9%',
      '--foreground': '0 0% 98%',
      '--card': '0 0% 3.9%',
      '--card-foreground': '0 0% 98%',
      '--popover': '0 0% 3.9%',
      '--popover-foreground': '0 0% 98%',
      '--primary': '0 0% 98%',
      '--primary-foreground': '0 0% 9%',
      '--secondary': '0 0% 14.9%',
      '--secondary-foreground': '0 0% 98%',
      '--muted': '0 0% 14.9%',
      '--muted-foreground': '0 0% 63.9%',
      '--accent': '0 0% 14.9%',
      '--accent-foreground': '0 0% 98%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 14.9%',
      '--input': '0 0% 14.9%',
      '--ring': '0 0% 83.1%',
      '--sidebar': '0 0% 3.9%',
      '--sidebar-foreground': '0 0% 63.9%',
      '--sidebar-primary': '0 0% 98%',
      '--sidebar-primary-foreground': '0 0% 9%',
      '--sidebar-accent': '0 0% 14.9%',
      '--sidebar-accent-foreground': '0 0% 98%',
      '--sidebar-border': '0 0% 14.9%',
      '--sidebar-ring': '0 0% 83.1%',
      '--chart-1': '12 76% 61%',
      '--chart-2': '173 58% 39%',
      '--chart-3': '197 37% 24%',
      '--chart-4': '43 74% 66%',
      '--chart-5': '27 87% 67%'
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme',
    preview: '#ffffff',
    variables: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 3.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 3.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 3.9%',
      '--primary': '0 0% 9%',
      '--primary-foreground': '0 0% 98%',
      '--secondary': '0 0% 96.1%',
      '--secondary-foreground': '0 0% 9%',
      '--muted': '0 0% 96.1%',
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '0 0% 96.1%',
      '--accent-foreground': '0 0% 9%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 89.8%',
      '--input': '0 0% 89.8%',
      '--ring': '0 0% 3.9%',
      '--sidebar': '0 0% 98%',
      '--sidebar-foreground': '0 0% 45.1%',
      '--sidebar-primary': '0 0% 9%',
      '--sidebar-primary-foreground': '0 0% 98%',
      '--sidebar-accent': '0 0% 96.1%',
      '--sidebar-accent-foreground': '0 0% 9%',
      '--sidebar-border': '0 0% 89.8%',
      '--sidebar-ring': '0 0% 3.9%',
      '--chart-1': '12 76% 61%',
      '--chart-2': '173 58% 39%',
      '--chart-3': '197 37% 24%',
      '--chart-4': '43 74% 66%',
      '--chart-5': '27 87% 67%'
    }
  },
  {
    id: 'spotify-dark',
    name: 'Spotify Dark',
    description: 'Spotify-inspired dark theme',
    preview: 'linear-gradient(135deg, #1DB954 0%, #121212 100%)',
    variables: {
      '--background': '0 0% 7%',        // #121212
      '--foreground': '0 0% 100%',      // #ffffff
      '--card': '0 0% 11%',             // #1c1c1c
      '--card-foreground': '0 0% 100%',
      '--popover': '0 0% 11%',
      '--popover-foreground': '0 0% 100%',
      '--primary': '141 76% 48%',       // #1DB954 Spotify green
      '--primary-foreground': '0 0% 100%',
      '--secondary': '0 0% 18%',        // #2e2e2e
      '--secondary-foreground': '0 0% 100%',
      '--muted': '0 0% 18%',
      '--muted-foreground': '0 0% 70%',
      '--accent': '141 76% 48%',        // Spotify green
      '--accent-foreground': '0 0% 100%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 20%',
      '--input': '0 0% 20%',
      '--ring': '141 76% 48%',
      '--sidebar': '0 0% 7%',
      '--sidebar-foreground': '0 0% 70%',
      '--sidebar-primary': '141 76% 48%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '0 0% 18%',
      '--sidebar-accent-foreground': '0 0% 100%',
      '--sidebar-border': '0 0% 20%',
      '--sidebar-ring': '141 76% 48%',
      '--chart-1': '141 76% 48%',
      '--chart-2': '173 58% 39%',
      '--chart-3': '197 37% 24%',
      '--chart-4': '43 74% 66%',
      '--chart-5': '27 87% 67%'
    }
  }
]

// Display styles for music displays (public)
export const displayStyles: DisplayStyle[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple display',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-white',
      cardBackground: 'bg-white/90 backdrop-blur-sm',
      cardBorder: 'border border-gray-200',
      text: 'text-gray-900',
      secondaryText: 'text-gray-600',
      accent: 'text-black',
      progressBar: 'bg-black',
      progressBackground: 'bg-gray-200',
      shadow: 'shadow-sm',
      hover: 'hover:bg-gray-50',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-md'
    }
  },
  {
    id: 'spotify-classic',
    name: 'Spotify Classic',
    description: 'Official Spotify green theme',
    preview: 'linear-gradient(135deg, #1DB954 0%, #121212 100%)',
    category: 'spotify',
    styles: {
      background: 'bg-gradient-to-br from-black to-gray-900',
      cardBackground: 'bg-gray-900/90 backdrop-blur-xl',
      cardBorder: 'border border-green-500/30',
      text: 'text-white',
      secondaryText: 'text-gray-300',
      accent: 'text-green-400',
      progressBar: 'bg-green-400',
      progressBackground: 'bg-gray-700',
      shadow: 'shadow-xl shadow-green-500/10',
      hover: 'hover:bg-gray-800/50',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    description: 'Cyberpunk-inspired purple glow',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #1F1B24 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-purple-900 via-black to-purple-800',
      cardBackground: 'bg-black/80 backdrop-blur-xl border-purple-500/30',
      cardBorder: 'border border-purple-500/50 shadow-lg shadow-purple-500/20',
      text: 'text-purple-100',
      secondaryText: 'text-purple-300',
      accent: 'text-purple-400',
      progressBar: 'bg-purple-400',
      progressBackground: 'bg-purple-900/50',
      shadow: 'shadow-xl shadow-purple-500/25',
      hover: 'hover:bg-purple-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    },
    customCSS: `
      .glow-text {
        text-shadow: 0 0 10px rgb(168 85 247 / 0.5);
      }
      .neon-border {
        box-shadow: 0 0 15px rgb(168 85 247 / 0.3), inset 0 0 15px rgb(168 85 247 / 0.1);
      }
    `
  },
  {
    id: 'retro-wave',
    name: 'Retro Wave',
    description: '80s synthwave aesthetic',
    preview: 'linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%)',
    category: 'retro',
    styles: {
      background: 'bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500',
      cardBackground: 'bg-black/70 backdrop-blur-xl',
      cardBorder: 'border border-pink-400/50',
      text: 'text-white',
      secondaryText: 'text-pink-200',
      accent: 'text-pink-400',
      progressBar: 'bg-gradient-to-r from-pink-400 to-blue-400',
      progressBackground: 'bg-gray-800/50',
      shadow: 'shadow-xl shadow-pink-500/20',
      hover: 'hover:bg-pink-900/20',
      fontFamily: 'font-mono',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    },
    customCSS: `
      .retro-glow {
        text-shadow: 0 0 20px rgb(236 72 153 / 0.8);
      }
      .scan-lines::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(transparent 50%, rgba(236, 72, 153, 0.1) 51%);
        background-size: 100% 4px;
        pointer-events: none;
      }
    `
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calming blue ocean waves',
    preview: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
      cardBackground: 'bg-white/20 backdrop-blur-lg',
      cardBorder: 'border border-blue-300/40',
      text: 'text-white',
      secondaryText: 'text-blue-100',
      accent: 'text-blue-200',
      progressBar: 'bg-blue-300',
      progressBackground: 'bg-blue-800/30',
      shadow: 'shadow-xl shadow-blue-500/30',
      hover: 'hover:bg-white/10',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    },
    customCSS: `
      .wave-animation {
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
        background-size: 200% 200%;
        animation: wave 3s ease-in-out infinite;
      }
      @keyframes wave {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `
  },
  {
    id: 'forest-dark',
    name: 'Forest Dark',
    description: 'Deep forest vibes with emerald accents',
    preview: 'linear-gradient(135deg, #1B4332 0%, #081C15 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-green-900 via-gray-900 to-green-800',
      cardBackground: 'bg-black/70 backdrop-blur-xl',
      cardBorder: 'border border-green-400/40',
      text: 'text-green-100',
      secondaryText: 'text-green-300',
      accent: 'text-green-400',
      progressBar: 'bg-green-400',
      progressBackground: 'bg-green-900/50',
      shadow: 'shadow-xl shadow-green-900/50',
      hover: 'hover:bg-green-900/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm sunset colors',
    preview: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400',
      cardBackground: 'bg-black/60 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-white',
      secondaryText: 'text-orange-100',
      accent: 'text-orange-300',
      progressBar: 'bg-orange-300',
      progressBackground: 'bg-orange-900/40',
      shadow: 'shadow-xl shadow-orange-500/30',
      hover: 'hover:bg-orange-900/20',
      fontFamily: 'font-sans',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'cyberpunk-red',
    name: 'Cyberpunk Red',
    description: 'Futuristic red cyberpunk theme',
    preview: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-red-600 via-black to-red-800',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-red-500/60',
      text: 'text-red-100',
      secondaryText: 'text-red-300',
      accent: 'text-red-400',
      progressBar: 'bg-red-400',
      progressBackground: 'bg-red-900/50',
      shadow: 'shadow-xl shadow-red-500/40',
      hover: 'hover:bg-red-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    },
    customCSS: `
      .cyber-glow {
        text-shadow: 0 0 15px rgb(239 68 68 / 0.8);
      }
      .cyber-grid::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
      }
    `
  },
  {
    id: 'gaming-green',
    name: 'Gaming Green',
    description: 'Matrix-style green on black',
    preview: 'linear-gradient(135deg, #00FF41 0%, #003D1A 100%)',
    category: 'gaming',
    styles: {
      background: 'bg-black',
      cardBackground: 'bg-green-950/50 backdrop-blur-lg',
      cardBorder: 'border border-green-400/60',
      text: 'text-green-400',
      secondaryText: 'text-green-300',
      accent: 'text-green-500',
      progressBar: 'bg-green-400',
      progressBackground: 'bg-green-900/30',
      shadow: 'shadow-xl shadow-green-400/30',
      hover: 'hover:bg-green-900/20',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-md'
    },
    customCSS: `
      .matrix-text {
        text-shadow: 0 0 10px rgb(34 197 94 / 0.8);
      }
      .matrix-rain::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(transparent 70%, rgba(34, 197, 94, 0.1) 71%);
        background-size: 100% 2px;
        animation: rain 2s linear infinite;
      }
      @keyframes rain {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
    `
  },
  {
    id: 'ice-blue',
    name: 'Ice Blue',
    description: 'Cool ice blue with crystal effects',
    preview: 'linear-gradient(135deg, #E0F2F1 0%, #006064 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-cyan-100 via-blue-200 to-cyan-600',
      cardBackground: 'bg-white/30 backdrop-blur-xl',
      cardBorder: 'border border-cyan-300/60',
      text: 'text-cyan-900',
      secondaryText: 'text-cyan-700',
      accent: 'text-cyan-600',
      progressBar: 'bg-cyan-600',
      progressBackground: 'bg-cyan-200/50',
      shadow: 'shadow-xl shadow-cyan-300/40',
      hover: 'hover:bg-white/20',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    },
    customCSS: `
      .ice-crystal {
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
        background-size: 20px 20px;
      }
    `
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic black and white',
    preview: 'linear-gradient(135deg, #000000 0%, #FFFFFF 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gray-100',
      cardBackground: 'bg-white backdrop-blur-sm',
      cardBorder: 'border-2 border-black',
      text: 'text-black',
      secondaryText: 'text-gray-700',
      accent: 'text-gray-900',
      progressBar: 'bg-black',
      progressBackground: 'bg-gray-300',
      shadow: 'shadow-lg',
      hover: 'hover:bg-gray-50',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-none'
    }
  },
  {
    id: 'galaxy-purple',
    name: 'Galaxy Purple',
    description: 'Deep space galaxy with purple nebula',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black',
      cardBackground: 'bg-black/60 backdrop-blur-xl',
      cardBorder: 'border border-purple-400/50',
      text: 'text-purple-100',
      secondaryText: 'text-purple-300',
      accent: 'text-purple-400',
      progressBar: 'bg-gradient-to-r from-purple-400 to-pink-400',
      progressBackground: 'bg-purple-900/30',
      shadow: 'shadow-2xl shadow-purple-500/25',
      hover: 'hover:bg-purple-900/20',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    },
    customCSS: `
      .galaxy-stars::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
                          radial-gradient(2px 2px at 40px 70px, white, transparent),
                          radial-gradient(1px 1px at 90px 40px, white, transparent),
                          radial-gradient(1px 1px at 130px 80px, white, transparent);
        background-repeat: repeat;
        background-size: 200px 100px;
        animation: sparkle 4s ease-in-out infinite;
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }
    `
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    description: 'Elegant gold and black luxury theme',
    preview: 'linear-gradient(135deg, #FFD700 0%, #000000 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-black',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-yellow-400/60',
      text: 'text-yellow-100',
      secondaryText: 'text-yellow-300',
      accent: 'text-yellow-400',
      progressBar: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      progressBackground: 'bg-yellow-900/30',
      shadow: 'shadow-xl shadow-yellow-500/30',
      hover: 'hover:bg-yellow-900/20',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-lg'
    },
    customCSS: `
      .gold-shine {
        background: linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%);
        background-size: 200% 200%;
        animation: shine 3s ease-in-out infinite;
      }
      @keyframes shine {
        0%, 100% { background-position: -200% -200%; }
        50% { background-position: 200% 200%; }
      }
    `
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Northern lights inspired theme',
    preview: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #FF0080 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-teal-400 via-green-400 to-purple-500',
      cardBackground: 'bg-black/50 backdrop-blur-xl',
      cardBorder: 'border border-green-300/50',
      text: 'text-white',
      secondaryText: 'text-green-200',
      accent: 'text-green-300',
      progressBar: 'bg-gradient-to-r from-green-400 to-teal-400',
      progressBackground: 'bg-green-900/30',
      shadow: 'shadow-xl shadow-green-400/30',
      hover: 'hover:bg-green-900/20',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    },
    customCSS: `
      .aurora-waves {
        background: linear-gradient(45deg,
          rgba(0, 255, 255, 0.1) 0%,
          rgba(0, 255, 0, 0.1) 25%,
          rgba(255, 0, 255, 0.1) 50%,
          rgba(0, 255, 0, 0.1) 75%,
          rgba(0, 255, 255, 0.1) 100%);
        background-size: 400% 400%;
        animation: aurora 8s ease-in-out infinite;
      }
      @keyframes aurora {
        0%, 100% { background-position: 0% 50%; }
        25% { background-position: 100% 0%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
      }
    `
  }
]

export function getAppTheme(themeId: string): AppTheme {
  return appThemes.find(theme => theme.id === themeId) || appThemes[0]
}

export function getDisplayStyle(styleId: string): DisplayStyle {
  return displayStyles.find(style => style.id === styleId) || displayStyles[0]
}
