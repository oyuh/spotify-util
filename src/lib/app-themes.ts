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
  category: 'minimal' | 'modern' | 'retro' | 'neon' | 'spotify' | 'nature' | 'gaming'
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
    preview: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/90 backdrop-blur-sm',
      cardBorder: 'border border-gray-700',
      text: 'text-gray-100',
      secondaryText: 'text-gray-400',
      accent: 'text-white',
      progressBar: 'bg-white',
      progressBackground: 'bg-gray-700',
      shadow: 'shadow-sm',
      hover: 'hover:bg-gray-800',
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
  },
  // NEW STYLES START HERE - 50 Additional Display Styles
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Vibrant underwater coral reef',
    preview: 'linear-gradient(135deg, #FF7F7F 0%, #00CED1 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-orange-400 via-pink-400 to-cyan-500',
      cardBackground: 'bg-cyan-900/60 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-white',
      secondaryText: 'text-orange-200',
      accent: 'text-pink-300',
      progressBar: 'bg-orange-400',
      progressBackground: 'bg-cyan-800/30',
      shadow: 'shadow-xl shadow-orange-400/25',
      hover: 'hover:bg-cyan-900/20',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'neon-cyan',
    name: 'Neon Cyan',
    description: 'Electric cyan cyberpunk vibes',
    preview: 'linear-gradient(135deg, #00FFFF 0%, #1A1A2E 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-cyan-400 via-blue-800 to-black',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-cyan-400/60',
      text: 'text-cyan-100',
      secondaryText: 'text-cyan-300',
      accent: 'text-cyan-400',
      progressBar: 'bg-cyan-400',
      progressBackground: 'bg-cyan-900/50',
      shadow: 'shadow-xl shadow-cyan-400/40',
      hover: 'hover:bg-cyan-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    description: 'Warm desert evening colors',
    preview: 'linear-gradient(135deg, #FF8A65 0%, #FFCC02 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-orange-300 via-yellow-400 to-red-400',
      cardBackground: 'bg-orange-900/70 backdrop-blur-xl',
      cardBorder: 'border border-yellow-300/50',
      text: 'text-white',
      secondaryText: 'text-orange-100',
      accent: 'text-yellow-300',
      progressBar: 'bg-yellow-400',
      progressBackground: 'bg-orange-800/40',
      shadow: 'shadow-xl shadow-orange-400/30',
      hover: 'hover:bg-orange-800/20',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep midnight ocean blue',
    preview: 'linear-gradient(135deg, #191970 0%, #000080 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-blue-900 to-indigo-900',
      cardBackground: 'bg-blue-950/80 backdrop-blur-xl',
      cardBorder: 'border border-blue-400/40',
      text: 'text-blue-100',
      secondaryText: 'text-blue-300',
      accent: 'text-blue-400',
      progressBar: 'bg-blue-400',
      progressBackground: 'bg-blue-800/50',
      shadow: 'shadow-xl shadow-blue-500/20',
      hover: 'hover:bg-blue-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    description: 'Soft pink Japanese spring',
    preview: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-400',
      cardBackground: 'bg-white/80 backdrop-blur-xl',
      cardBorder: 'border border-pink-300/60',
      text: 'text-pink-900',
      secondaryText: 'text-pink-700',
      accent: 'text-rose-600',
      progressBar: 'bg-pink-500',
      progressBackground: 'bg-pink-200/60',
      shadow: 'shadow-xl shadow-pink-300/40',
      hover: 'hover:bg-pink-100/50',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'electric-lime',
    name: 'Electric Lime',
    description: 'High voltage lime green',
    preview: 'linear-gradient(135deg, #32CD32 0%, #00FF00 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-600',
      cardBackground: 'bg-black/70 backdrop-blur-xl',
      cardBorder: 'border border-lime-400/60',
      text: 'text-lime-100',
      secondaryText: 'text-lime-300',
      accent: 'text-lime-400',
      progressBar: 'bg-lime-400',
      progressBackground: 'bg-lime-900/40',
      shadow: 'shadow-xl shadow-lime-400/40',
      hover: 'hover:bg-lime-900/20',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant deep purple royalty',
    preview: 'linear-gradient(135deg, #4B0082 0%, #800080 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-purple-800 via-violet-700 to-purple-900',
      cardBackground: 'bg-purple-950/80 backdrop-blur-xl',
      cardBorder: 'border border-purple-400/50',
      text: 'text-purple-100',
      secondaryText: 'text-purple-300',
      accent: 'text-purple-400',
      progressBar: 'bg-purple-400',
      progressBackground: 'bg-purple-800/50',
      shadow: 'shadow-xl shadow-purple-500/30',
      hover: 'hover:bg-purple-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'copper-bronze',
    name: 'Copper Bronze',
    description: 'Warm metallic copper tones',
    preview: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-orange-600 via-amber-700 to-yellow-700',
      cardBackground: 'bg-amber-900/80 backdrop-blur-xl',
      cardBorder: 'border border-orange-400/50',
      text: 'text-amber-100',
      secondaryText: 'text-orange-200',
      accent: 'text-orange-300',
      progressBar: 'bg-orange-400',
      progressBackground: 'bg-amber-800/50',
      shadow: 'shadow-xl shadow-orange-500/30',
      hover: 'hover:bg-amber-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    description: 'Cold arctic ice and snow',
    preview: 'linear-gradient(135deg, #E6F3FF 0%, #B3D9FF 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-200',
      cardBackground: 'bg-white/90 backdrop-blur-xl',
      cardBorder: 'border border-slate-300/60',
      text: 'text-slate-800',
      secondaryText: 'text-slate-600',
      accent: 'text-blue-600',
      progressBar: 'bg-blue-500',
      progressBackground: 'bg-slate-200/60',
      shadow: 'shadow-xl shadow-slate-300/40',
      hover: 'hover:bg-slate-50/50',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'volcano-fire',
    name: 'Volcano Fire',
    description: 'Molten lava and fire',
    preview: 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-red-500 via-orange-600 to-yellow-500',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-red-400/60',
      text: 'text-red-100',
      secondaryText: 'text-orange-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-gradient-to-r from-red-400 to-yellow-400',
      progressBackground: 'bg-red-900/50',
      shadow: 'shadow-xl shadow-red-500/40',
      hover: 'hover:bg-red-900/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'mystic-forest',
    name: 'Mystic Forest',
    description: 'Enchanted magical forest',
    preview: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800',
      cardBackground: 'bg-green-950/70 backdrop-blur-xl',
      cardBorder: 'border border-emerald-400/50',
      text: 'text-emerald-100',
      secondaryText: 'text-green-200',
      accent: 'text-emerald-300',
      progressBar: 'bg-emerald-400',
      progressBackground: 'bg-green-800/50',
      shadow: 'shadow-xl shadow-emerald-400/30',
      hover: 'hover:bg-emerald-900/20',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'space-odyssey',
    name: 'Space Odyssey',
    description: 'Deep space exploration theme',
    preview: 'linear-gradient(135deg, #000000 0%, #4B0082 50%, #191970 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-black via-purple-900 to-indigo-900',
      cardBackground: 'bg-black/90 backdrop-blur-xl',
      cardBorder: 'border border-indigo-400/50',
      text: 'text-indigo-100',
      secondaryText: 'text-purple-200',
      accent: 'text-indigo-300',
      progressBar: 'bg-gradient-to-r from-indigo-400 to-purple-400',
      progressBackground: 'bg-indigo-900/50',
      shadow: 'shadow-xl shadow-indigo-500/30',
      hover: 'hover:bg-indigo-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    description: 'Sweet pastel pink and blue',
    preview: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-300',
      cardBackground: 'bg-white/80 backdrop-blur-xl',
      cardBorder: 'border border-pink-200/60',
      text: 'text-purple-800',
      secondaryText: 'text-pink-600',
      accent: 'text-blue-600',
      progressBar: 'bg-gradient-to-r from-pink-400 to-blue-400',
      progressBackground: 'bg-purple-200/60',
      shadow: 'shadow-xl shadow-pink-300/30',
      hover: 'hover:bg-purple-100/50',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'emerald-city',
    name: 'Emerald City',
    description: 'Magical emerald green glow',
    preview: 'linear-gradient(135deg, #50C878 0%, #008B8B 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
      cardBackground: 'bg-emerald-900/70 backdrop-blur-xl',
      cardBorder: 'border border-emerald-300/50',
      text: 'text-emerald-100',
      secondaryText: 'text-teal-200',
      accent: 'text-emerald-300',
      progressBar: 'bg-emerald-400',
      progressBackground: 'bg-emerald-800/50',
      shadow: 'shadow-xl shadow-emerald-400/30',
      hover: 'hover:bg-emerald-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'blood-moon',
    name: 'Blood Moon',
    description: 'Dark crimson lunar eclipse',
    preview: 'linear-gradient(135deg, #8B0000 0%, #4B0000 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-red-900 via-black to-red-800',
      cardBackground: 'bg-black/90 backdrop-blur-xl',
      cardBorder: 'border border-red-600/60',
      text: 'text-red-100',
      secondaryText: 'text-red-300',
      accent: 'text-red-400',
      progressBar: 'bg-red-500',
      progressBackground: 'bg-red-900/50',
      shadow: 'shadow-xl shadow-red-600/40',
      hover: 'hover:bg-red-900/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Soft purple lavender fields',
    preview: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-purple-200 via-violet-300 to-purple-400',
      cardBackground: 'bg-white/85 backdrop-blur-xl',
      cardBorder: 'border border-purple-300/50',
      text: 'text-purple-900',
      secondaryText: 'text-violet-700',
      accent: 'text-purple-600',
      progressBar: 'bg-purple-500',
      progressBackground: 'bg-purple-200/60',
      shadow: 'shadow-xl shadow-purple-300/40',
      hover: 'hover:bg-purple-100/50',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'neon-yellow',
    name: 'Neon Yellow',
    description: 'Electric bright yellow energy',
    preview: 'linear-gradient(135deg, #FFFF00 0%, #FFD700 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-yellow-400/70',
      text: 'text-yellow-100',
      secondaryText: 'text-amber-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-yellow-400',
      progressBackground: 'bg-yellow-900/50',
      shadow: 'shadow-xl shadow-yellow-400/50',
      hover: 'hover:bg-yellow-900/20',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'storm-clouds',
    name: 'Storm Clouds',
    description: 'Dark stormy weather',
    preview: 'linear-gradient(135deg, #2F4F4F 0%, #696969 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800',
      cardBackground: 'bg-slate-900/80 backdrop-blur-xl',
      cardBorder: 'border border-slate-400/50',
      text: 'text-slate-200',
      secondaryText: 'text-slate-400',
      accent: 'text-slate-300',
      progressBar: 'bg-slate-400',
      progressBackground: 'bg-slate-700/50',
      shadow: 'shadow-xl shadow-slate-600/40',
      hover: 'hover:bg-slate-700/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Vibrant tropical beach vibes',
    preview: 'linear-gradient(135deg, #00CED1 0%, #FF6347 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-turquoise-400 via-teal-400 to-orange-400',
      cardBackground: 'bg-teal-900/60 backdrop-blur-xl',
      cardBorder: 'border border-turquoise-300/50',
      text: 'text-white',
      secondaryText: 'text-turquoise-100',
      accent: 'text-orange-300',
      progressBar: 'bg-gradient-to-r from-turquoise-400 to-orange-400',
      progressBackground: 'bg-teal-800/40',
      shadow: 'shadow-xl shadow-turquoise-400/30',
      hover: 'hover:bg-teal-800/20',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'silver-chrome',
    name: 'Silver Chrome',
    description: 'Metallic chrome finish',
    preview: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500',
      cardBackground: 'bg-gray-800/90 backdrop-blur-xl',
      cardBorder: 'border border-gray-400/60',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      accent: 'text-gray-200',
      progressBar: 'bg-gray-300',
      progressBackground: 'bg-gray-600/50',
      shadow: 'shadow-xl shadow-gray-400/40',
      hover: 'hover:bg-gray-700/30',
      fontFamily: 'font-mono',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'sunset-beach',
    name: 'Sunset Beach',
    description: 'Golden hour beach sunset',
    preview: 'linear-gradient(135deg, #FFA500 0%, #FF4500 50%, #8B008B 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-orange-300 via-red-400 to-purple-500',
      cardBackground: 'bg-purple-900/70 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-white',
      secondaryText: 'text-orange-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-gradient-to-r from-orange-400 to-purple-400',
      progressBackground: 'bg-purple-800/40',
      shadow: 'shadow-xl shadow-orange-400/30',
      hover: 'hover:bg-purple-800/20',
      fontFamily: 'font-sans',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    description: 'Cool refreshing mint green',
    preview: 'linear-gradient(135deg, #98FB98 0%, #00FA9A 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400',
      cardBackground: 'bg-white/85 backdrop-blur-xl',
      cardBorder: 'border border-green-300/60',
      text: 'text-green-900',
      secondaryText: 'text-emerald-700',
      accent: 'text-teal-600',
      progressBar: 'bg-emerald-500',
      progressBackground: 'bg-green-200/60',
      shadow: 'shadow-xl shadow-green-300/40',
      hover: 'hover:bg-green-100/50',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    description: 'Colorful space nebula',
    preview: 'linear-gradient(135deg, #FF1493 0%, #00BFFF 50%, #9400D3 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-pink-500 via-blue-500 to-purple-600',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-pink-400/50',
      text: 'text-pink-100',
      secondaryText: 'text-blue-200',
      accent: 'text-purple-300',
      progressBar: 'bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400',
      progressBackground: 'bg-purple-900/50',
      shadow: 'shadow-xl shadow-pink-500/30',
      hover: 'hover:bg-purple-900/20',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    description: 'Fall foliage colors',
    preview: 'linear-gradient(135deg, #FF8C00 0%, #DC143C 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-orange-400 via-red-500 to-amber-600',
      cardBackground: 'bg-amber-900/80 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-orange-100',
      secondaryText: 'text-amber-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-orange-400',
      progressBackground: 'bg-amber-800/50',
      shadow: 'shadow-xl shadow-orange-400/40',
      hover: 'hover:bg-amber-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    description: 'High voltage electric blue',
    preview: 'linear-gradient(135deg, #0080FF 0%, #0040FF 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-blue-400/70',
      text: 'text-blue-100',
      secondaryText: 'text-blue-300',
      accent: 'text-blue-400',
      progressBar: 'bg-blue-400',
      progressBackground: 'bg-blue-900/50',
      shadow: 'shadow-xl shadow-blue-400/50',
      hover: 'hover:bg-blue-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant rose gold luxury',
    preview: 'linear-gradient(135deg, #E8B4B8 0%, #D4A574 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-rose-300 via-pink-400 to-orange-400',
      cardBackground: 'bg-rose-900/70 backdrop-blur-xl',
      cardBorder: 'border border-rose-300/60',
      text: 'text-rose-100',
      secondaryText: 'text-pink-200',
      accent: 'text-orange-300',
      progressBar: 'bg-gradient-to-r from-rose-400 to-orange-400',
      progressBackground: 'bg-rose-800/50',
      shadow: 'shadow-xl shadow-rose-400/30',
      hover: 'hover:bg-rose-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    description: 'Mysterious deep sea depths',
    preview: 'linear-gradient(135deg, #003366 0%, #001122 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950',
      cardBackground: 'bg-slate-950/90 backdrop-blur-xl',
      cardBorder: 'border border-blue-400/40',
      text: 'text-blue-200',
      secondaryText: 'text-slate-400',
      accent: 'text-blue-300',
      progressBar: 'bg-blue-400',
      progressBackground: 'bg-blue-900/50',
      shadow: 'shadow-xl shadow-blue-500/20',
      hover: 'hover:bg-blue-900/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    description: 'Hot pink electric glow',
    preview: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-700',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-pink-400/70',
      text: 'text-pink-100',
      secondaryText: 'text-fuchsia-200',
      accent: 'text-pink-300',
      progressBar: 'bg-pink-400',
      progressBackground: 'bg-pink-900/50',
      shadow: 'shadow-xl shadow-pink-400/50',
      hover: 'hover:bg-pink-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Deep pine forest green',
    preview: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-green-700 via-emerald-800 to-green-900',
      cardBackground: 'bg-green-950/80 backdrop-blur-xl',
      cardBorder: 'border border-green-400/50',
      text: 'text-green-100',
      secondaryText: 'text-emerald-200',
      accent: 'text-green-300',
      progressBar: 'bg-green-400',
      progressBackground: 'bg-green-800/50',
      shadow: 'shadow-xl shadow-green-400/30',
      hover: 'hover:bg-green-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    description: 'Smooth sunset color transition',
    preview: 'linear-gradient(135deg, #FFA726 0%, #FF5722 50%, #E91E63 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
      cardBackground: 'bg-red-900/70 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-white',
      secondaryText: 'text-orange-200',
      accent: 'text-pink-300',
      progressBar: 'bg-gradient-to-r from-orange-400 to-pink-400',
      progressBackground: 'bg-red-800/50',
      shadow: 'shadow-xl shadow-orange-400/30',
      hover: 'hover:bg-red-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'steel-gray',
    name: 'Steel Gray',
    description: 'Industrial steel gray',
    preview: 'linear-gradient(135deg, #708090 0%, #2F4F4F 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700',
      cardBackground: 'bg-slate-800/90 backdrop-blur-xl',
      cardBorder: 'border border-slate-400/60',
      text: 'text-slate-100',
      secondaryText: 'text-slate-300',
      accent: 'text-slate-200',
      progressBar: 'bg-slate-400',
      progressBackground: 'bg-slate-600/50',
      shadow: 'shadow-xl shadow-slate-500/40',
      hover: 'hover:bg-slate-700/30',
      fontFamily: 'font-mono',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'grape-purple',
    name: 'Grape Purple',
    description: 'Rich grape purple tones',
    preview: 'linear-gradient(135deg, #9932CC 0%, #8B008B 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-purple-600 via-violet-700 to-fuchsia-800',
      cardBackground: 'bg-purple-950/80 backdrop-blur-xl',
      cardBorder: 'border border-purple-400/50',
      text: 'text-purple-100',
      secondaryText: 'text-violet-200',
      accent: 'text-purple-300',
      progressBar: 'bg-purple-400',
      progressBackground: 'bg-purple-800/50',
      shadow: 'shadow-xl shadow-purple-400/30',
      hover: 'hover:bg-purple-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'amber-glow',
    name: 'Amber Glow',
    description: 'Warm amber honey glow',
    preview: 'linear-gradient(135deg, #FFBF00 0%, #FF8C00 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-amber-300 via-orange-400 to-yellow-500',
      cardBackground: 'bg-amber-900/80 backdrop-blur-xl',
      cardBorder: 'border border-amber-300/60',
      text: 'text-amber-100',
      secondaryText: 'text-orange-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-amber-400',
      progressBackground: 'bg-amber-800/50',
      shadow: 'shadow-xl shadow-amber-400/40',
      hover: 'hover:bg-amber-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'crimson-red',
    name: 'Crimson Red',
    description: 'Deep crimson red passion',
    preview: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-red-600 via-red-700 to-red-900',
      cardBackground: 'bg-red-950/80 backdrop-blur-xl',
      cardBorder: 'border border-red-400/60',
      text: 'text-red-100',
      secondaryText: 'text-red-300',
      accent: 'text-red-400',
      progressBar: 'bg-red-500',
      progressBackground: 'bg-red-800/50',
      shadow: 'shadow-xl shadow-red-500/40',
      hover: 'hover:bg-red-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'seafoam-green',
    name: 'Seafoam Green',
    description: 'Soft ocean foam green',
    preview: 'linear-gradient(135deg, #20B2AA 0%, #5F9EA0 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500',
      cardBackground: 'bg-teal-900/70 backdrop-blur-xl',
      cardBorder: 'border border-teal-300/50',
      text: 'text-teal-100',
      secondaryText: 'text-cyan-200',
      accent: 'text-teal-300',
      progressBar: 'bg-teal-400',
      progressBackground: 'bg-teal-800/50',
      shadow: 'shadow-xl shadow-teal-400/30',
      hover: 'hover:bg-teal-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Dark midnight purple mystery',
    preview: 'linear-gradient(135deg, #2E0854 0%, #1A0B3D 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-purple-900 via-indigo-950 to-black',
      cardBackground: 'bg-black/90 backdrop-blur-xl',
      cardBorder: 'border border-purple-500/40',
      text: 'text-purple-200',
      secondaryText: 'text-purple-400',
      accent: 'text-purple-300',
      progressBar: 'bg-purple-500',
      progressBackground: 'bg-purple-900/50',
      shadow: 'shadow-xl shadow-purple-500/20',
      hover: 'hover:bg-purple-900/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'coral-pink',
    name: 'Coral Pink',
    description: 'Vibrant coral pink reef',
    preview: 'linear-gradient(135deg, #FF7F50 0%, #FF6347 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-orange-400 via-pink-500 to-red-500',
      cardBackground: 'bg-orange-900/70 backdrop-blur-xl',
      cardBorder: 'border border-orange-300/50',
      text: 'text-orange-100',
      secondaryText: 'text-pink-200',
      accent: 'text-orange-300',
      progressBar: 'bg-orange-400',
      progressBackground: 'bg-orange-800/50',
      shadow: 'shadow-xl shadow-orange-400/30',
      hover: 'hover:bg-orange-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    description: 'Vibrant electric violet energy',
    preview: 'linear-gradient(135deg, #8A2BE2 0%, #9400D3 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-violet-400/70',
      text: 'text-violet-100',
      secondaryText: 'text-purple-200',
      accent: 'text-violet-300',
      progressBar: 'bg-violet-400',
      progressBackground: 'bg-violet-900/50',
      shadow: 'shadow-xl shadow-violet-400/50',
      hover: 'hover:bg-violet-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden hour sunlight',
    preview: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-yellow-300 via-orange-400 to-amber-500',
      cardBackground: 'bg-orange-900/70 backdrop-blur-xl',
      cardBorder: 'border border-yellow-300/50',
      text: 'text-white',
      secondaryText: 'text-yellow-200',
      accent: 'text-amber-300',
      progressBar: 'bg-yellow-400',
      progressBackground: 'bg-orange-800/50',
      shadow: 'shadow-xl shadow-yellow-400/40',
      hover: 'hover:bg-orange-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-lg',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'arctic-blue',
    name: 'Arctic Blue',
    description: 'Cold arctic ice blue',
    preview: 'linear-gradient(135deg, #B0E0E6 0%, #4682B4 100%)',
    category: 'minimal',
    styles: {
      background: 'bg-gradient-to-br from-blue-200 via-sky-300 to-blue-500',
      cardBackground: 'bg-blue-900/70 backdrop-blur-xl',
      cardBorder: 'border border-blue-300/50',
      text: 'text-blue-100',
      secondaryText: 'text-sky-200',
      accent: 'text-blue-300',
      progressBar: 'bg-blue-400',
      progressBackground: 'bg-blue-800/50',
      shadow: 'shadow-xl shadow-blue-400/30',
      hover: 'hover:bg-blue-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'rainbow-prism',
    name: 'Rainbow Prism',
    description: 'Full spectrum rainbow colors',
    preview: 'linear-gradient(135deg, #FF0000 0%, #FF7F00 16.66%, #FFFF00 33.33%, #00FF00 50%, #0000FF 66.66%, #4B0082 83.33%, #9400D3 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-white/60',
      text: 'text-white',
      secondaryText: 'text-gray-200',
      accent: 'text-white',
      progressBar: 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400',
      progressBackground: 'bg-gray-800/50',
      shadow: 'shadow-xl shadow-white/30',
      hover: 'hover:bg-gray-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'mocha-coffee',
    name: 'Mocha Coffee',
    description: 'Rich coffee and cream tones',
    preview: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-amber-700 via-orange-800 to-yellow-800',
      cardBackground: 'bg-amber-950/80 backdrop-blur-xl',
      cardBorder: 'border border-orange-400/50',
      text: 'text-amber-100',
      secondaryText: 'text-orange-200',
      accent: 'text-yellow-300',
      progressBar: 'bg-orange-400',
      progressBackground: 'bg-amber-800/50',
      shadow: 'shadow-xl shadow-orange-400/30',
      hover: 'hover:bg-amber-800/30',
      fontFamily: 'font-serif',
      fontSize: 'text-base',
      borderRadius: 'rounded-lg'
    }
  },
  {
    id: 'lime-zest',
    name: 'Lime Zest',
    description: 'Fresh citrus lime green',
    preview: 'linear-gradient(135deg, #32CD32 0%, #ADFF2F 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-lime-400 via-green-400 to-yellow-400',
      cardBackground: 'bg-green-900/70 backdrop-blur-xl',
      cardBorder: 'border border-lime-300/60',
      text: 'text-lime-100',
      secondaryText: 'text-green-200',
      accent: 'text-lime-300',
      progressBar: 'bg-lime-400',
      progressBackground: 'bg-green-800/50',
      shadow: 'shadow-xl shadow-lime-400/30',
      hover: 'hover:bg-green-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'twilight-sky',
    name: 'Twilight Sky',
    description: 'Evening twilight colors',
    preview: 'linear-gradient(135deg, #191970 0%, #9370DB 50%, #FFB6C1 100%)',
    category: 'nature',
    styles: {
      background: 'bg-gradient-to-br from-indigo-800 via-purple-600 to-pink-400',
      cardBackground: 'bg-indigo-950/70 backdrop-blur-xl',
      cardBorder: 'border border-purple-400/50',
      text: 'text-indigo-100',
      secondaryText: 'text-purple-200',
      accent: 'text-pink-300',
      progressBar: 'bg-gradient-to-r from-indigo-400 to-pink-400',
      progressBackground: 'bg-indigo-800/50',
      shadow: 'shadow-xl shadow-purple-400/30',
      hover: 'hover:bg-indigo-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-2xl'
    }
  },
  {
    id: 'jade-green',
    name: 'Jade Green',
    description: 'Precious jade stone green',
    preview: 'linear-gradient(135deg, #00A86B 0%, #50C878 100%)',
    category: 'modern',
    styles: {
      background: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
      cardBackground: 'bg-emerald-950/80 backdrop-blur-xl',
      cardBorder: 'border border-emerald-400/60',
      text: 'text-emerald-100',
      secondaryText: 'text-green-200',
      accent: 'text-emerald-300',
      progressBar: 'bg-emerald-400',
      progressBackground: 'bg-emerald-800/50',
      shadow: 'shadow-xl shadow-emerald-400/40',
      hover: 'hover:bg-emerald-800/30',
      fontFamily: 'font-sans',
      fontSize: 'text-base',
      borderRadius: 'rounded-xl'
    }
  },
  {
    id: 'magenta-burst',
    name: 'Magenta Burst',
    description: 'Explosive magenta energy',
    preview: 'linear-gradient(135deg, #FF00FF 0%, #C71585 100%)',
    category: 'neon',
    styles: {
      background: 'bg-gradient-to-br from-fuchsia-500 via-pink-600 to-rose-700',
      cardBackground: 'bg-black/80 backdrop-blur-xl',
      cardBorder: 'border border-fuchsia-400/70',
      text: 'text-fuchsia-100',
      secondaryText: 'text-pink-200',
      accent: 'text-fuchsia-300',
      progressBar: 'bg-fuchsia-400',
      progressBackground: 'bg-fuchsia-900/50',
      shadow: 'shadow-xl shadow-fuchsia-400/50',
      hover: 'hover:bg-fuchsia-900/30',
      fontFamily: 'font-mono',
      fontSize: 'text-sm',
      borderRadius: 'rounded-lg'
    }
  }
]

export function getAppTheme(themeId: string): AppTheme {
  return appThemes.find(theme => theme.id === themeId) || appThemes[0]
}

export function getDisplayStyle(styleId: string): DisplayStyle {
  return displayStyles.find(style => style.id === styleId) || displayStyles[0]
}
