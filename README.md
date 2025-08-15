# JamLog - Share Your Spotify Activity in Style

A modern, privacy-first web application for sharing your Spotify listening activity with beautiful, customizable displays. Perfect for streamers, content creators, and music lovers who want to showcase their musical journey.

🌐 **Live at [jamlog.lol](https://jamlog.lol)**

## ✨ Features

### 🎵 **Real-Time Music Display**
- **Now Playing**: Display your current track with live progress updates
- **Recent History**: Show your last played tracks with detailed information
- **Rich Metadata**: Artist, album, duration, progress bars, and Spotify links
- **High-Quality Artwork**: Beautiful album covers directly from Spotify

### 🔒 **Privacy & Security**
- **Custom Slugs**: Create personalized URLs (e.g., `jamlog.lol/display/yourname`)
- **Private Mode**: Hide your display from public discovery
- **Granular Controls**: Choose exactly what information to share
- **Secure Authentication**: Industry-standard OAuth with Spotify

### 🎨 **Customizable Themes & Styling**
- **Multiple Themes**: Choose from various pre-built styles
- **Custom Backgrounds**: Upload your own background images
- **Advanced CSS**: Full custom styling for power users
- **Responsive Design**: Perfect on desktop, mobile, and tablets

### 📺 **Streaming & Content Creation**
- **OBS Integration**: Direct browser source URLs for streaming
- **Transparent Overlays**: Clean overlays for video content
- **Real-Time Updates**: Live music data updates every 5 seconds
- **Multiple Formats**: JSON API endpoints for custom integrations

### ⚡ **Modern Tech Stack**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and better development experience
- **MongoDB**: Reliable data storage with automatic backups
- **Tailwind CSS**: Utility-first styling with shadcn/ui components

## 🚀 Quick Start

### For Users
1. Visit [jamlog.lol](https://jamlog.lol)
2. Sign in with your Spotify account
3. Customize your display settings
4. Share your personalized URL: `jamlog.lol/display/[your-slug]`

### For Streamers
1. Set up your display at [jamlog.lol](https://jamlog.lol)
2. Copy your display URL from the dashboard
3. Add as Browser Source in OBS/XSplit
4. Customize position and styling as needed

## � Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB database (local or Atlas)
- Spotify Developer App

### Environment Configuration
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/jamlog
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string
```

### Installation & Development
```bash
git clone https://github.com/oyuh/spotify-util.git
cd spotify-util
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start developing.

## 📡 API Reference

### Public Endpoints
- `GET /api/display/[spotifyId]` - Display data by Spotify ID
- `GET /display/[identifier]` - Public display page

### Authenticated Endpoints
- `GET /api/user/preferences` - User settings and preferences
- `POST /api/user/preferences` - Update user configuration
- `POST /api/user/generate-slug` - Create custom URL slug
- `GET /api/spotify/current-track` - Current playing track
- `GET /api/spotify/recent-tracks` - Recent listening history

## 🎨 Customization Options

### Display Settings
- **Track Information**: Title, artist, album, duration
- **Progress Indicators**: Real-time playback progress
- **Recent Tracks**: Configurable history (1-20 tracks)
- **Visual Elements**: Album art, play status, timestamps

### Privacy Controls
- **Public Display**: Toggle visibility of your music activity
- **Custom URLs**: Create memorable, personalized links
- **Data Control**: Choose what information to display publicly

### Styling Options
- **Pre-built Themes**: Multiple professionally designed themes
- **Background Images**: Upload custom backgrounds
- **Custom CSS**: Advanced styling for developers
- **Streaming Mode**: Optimized transparent overlays

## 🏗 Architecture

### Core Technologies
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucide icons
- **Backend**: Next.js API routes, MongoDB native driver
- **Authentication**: NextAuth.js with Spotify OAuth
- **Deployment**: Vercel with automatic CI/CD

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── display/           # Public display pages
│   ├── dashboard/         # User dashboard
│   └── login/             # Authentication
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utilities and configuration
├── contexts/             # React contexts for state
└── types/               # TypeScript definitions
```

## 🔧 Configuration & Deployment

### Environment Variables
```bash
# Required
MONGODB_URI=            # MongoDB connection string
SPOTIFY_CLIENT_ID=      # Spotify app client ID
SPOTIFY_CLIENT_SECRET=  # Spotify app client secret
NEXTAUTH_URL=          # Your domain (https://jamlog.lol)
NEXTAUTH_SECRET=       # Random secure string

# Optional
NEXT_PUBLIC_APP_URL=   # Public app URL for metadata
```

### Spotify App Setup
1. Create app at [Spotify Developer Dashboard](https://developer.spotify.com/)
2. Add redirect URI: `https://your-domain.com/api/auth/callback/spotify`
3. Copy Client ID and Client Secret to environment variables

## 📊 Usage Analytics & Insights

- **Real-time Activity**: See what's playing across all users
- **Privacy-First**: No personal data collection or tracking
- **Performance**: Optimized for fast loading and real-time updates
- **Reliability**: Built for 99.9% uptime with error handling

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Test thoroughly across different browsers
5. Submit a pull request with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns
- Ensure mobile responsiveness
- Write meaningful commit messages
- Test authentication flows

## 📝 License & Legal

This project is open source under the MIT License. See [LICENSE](LICENSE) for details.

**Important**: This application uses the Spotify Web API under their Developer Terms of Service. Users must have a valid Spotify account and authorize the application to access their listening data.

## 🆘 Support & Community

- **Issues**: [GitHub Issues](https://github.com/oyuh/spotify-util/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oyuh/spotify-util/discussions)
- **Website**: [jamlog.lol](https://jamlog.lol)

---

**Built with ❤️ for music lovers, streamers, and developers**

*Share your musical journey with the world - beautifully, privately, and effortlessly.*
