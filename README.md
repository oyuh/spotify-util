# SpotifyUtil - Share Your Music Like Never Before

A modern, privacy-first web application for sharing your Spotify listening activity with beautiful, customizable displays. Perfect for streamers, music lovers, and anyone who wants to share their musical journey.

## ✨ Features

### 🎵 **Music Display**
- **Currently Playing Track**: Show what you're listening to in real-time
- **Recent Tracks**: Display your last 50 tracks with detailed information
- **Track Details**: Artist, album, duration, progress, and track credits
- **Album Artwork**: High-quality images from Spotify

### 🔒 **Privacy First**
- **Custom Private Links**: Create hidden URLs not tied to your Spotify ID
- **Granular Controls**: Choose exactly what information to display
- **Public/Private Toggle**: Control who can see your music data
- **Session Management**: Secure token handling with automatic refresh

### 🎨 **Customizable Display**
- **Modern UI**: Built with shadcn/ui components
- **Custom CSS**: Advanced styling options for power users
- **Streaming Mode**: Transparent backgrounds optimized for OBS
- **Responsive Design**: Works perfectly on all devices

### 📺 **Streaming Integration**
- **OBS-Ready Overlays**: Direct URLs for streaming software
- **Multiple Formats**: API endpoints and display pages
- **Real-time Updates**: Live music data for your streams
- **Position Controls**: Fixed positioning for streaming layouts

### ⚙️ **Comprehensive Settings**
- **Modal-Based Settings**: Accessible from any page
- **Full Dashboard Settings**: Extended options in the dashboard
- **Export/Import**: Easy configuration management
- **Link Management**: Copy and share your public URLs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (cloud or local)
- Spotify Developer Account

### Environment Setup
Create a `.env.local` file with:
```bash
MONGODB_URI=your_mongodb_connection_string
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/spotify-util.git
cd spotify-util

# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### 🔐 **Authentication**
1. Click "Sign in with Spotify"
2. Authorize the application
3. You'll be redirected to your dashboard

### 🎵 **Viewing Your Music**
- **Dashboard**: See your current track and recent listening history
- **Public Display**: Share your music at `/display/[your-id]`
- **API Endpoint**: Get JSON data at `/api/display/[your-id]`
- **Stream Overlay**: Use `/api/stream/[your-id]` for OBS

### ⚙️ **Configuring Settings**
1. Click the **Settings** button in the navigation or dashboard
2. Configure display options (what info to show)
3. Set privacy preferences and custom URLs
4. Copy your public links
5. Customize styling and streaming options

### 📺 **For Streamers**
1. Enable **Streaming Mode** in settings
2. Copy your stream URL: `/api/stream/[your-id]`
3. Add as Browser Source in OBS
4. Position and style as needed

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Spotify provider
- **Database**: MongoDB with native driver
- **UI Components**: shadcn/ui + Tailwind CSS
- **API Integration**: Spotify Web API
- **Token Management**: Automatic refresh with fallback handling

## 📡 API Endpoints

### Public Endpoints
- `GET /api/display/[identifier]` - Get current track data (JSON)
- `GET /api/stream/[identifier]` - Get streaming-optimized track data
- `GET /display/[identifier]` - Public display page

### Authenticated Endpoints
- `GET /api/user/preferences` - Get user settings
- `POST /api/user/preferences` - Update user settings
- `POST /api/user/generate-slug` - Generate custom URL slug
- `GET /api/spotify/current-track` - Get current track (authenticated)
- `GET /api/spotify/recent-tracks` - Get recent tracks (authenticated)

## 🔧 Configuration

### Display Options
- Track name, artist, album information
- Duration and progress indicators
- Track credits and additional metadata
- Recent tracks with customizable count (1-20)

### Privacy Settings
- Public display toggle
- Custom URL slugs for privacy
- Spotify ID hiding options

### Styling Options
- Theme selection
- Custom CSS for advanced users
- Streaming mode with transparent backgrounds
- Position controls for overlays

## 📝 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── SettingsModal.tsx
│   └── Navigation.tsx
├── lib/                # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   ├── db.ts          # Database helpers
│   └── spotify.ts     # Spotify API helpers
└── types/             # TypeScript definitions
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/spotify-util/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

Built with ❤️ for the music community

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
