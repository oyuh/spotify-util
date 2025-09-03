# JamLog 🎵

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.18-blue?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24-blue?logo=auth0)](https://next-auth.js.org/)
[![Vercel Analytics](https://img.shields.io/badge/Vercel_Analytics-1.5-blue?logo=vercel)](https://vercel.com/analytics)

🌐 **Live at [jamlog.lol](https://jamlog.lol)**

---

## Overview

**JamLog** is a modern, privacy-first web application for sharing your Spotify listening activity with beautiful, customizable displays. Built with Next.js, React, MongoDB, and NextAuth.js, it allows users to showcase their musical journey in real-time with granular privacy controls and seamless streaming integration.

---

## Table of Contents

- [JamLog 🎵](#jamlog-)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Display Types](#display-types)
    - [Now Playing](#now-playing)
    - [Recent Tracks](#recent-tracks)
    - [Custom Themes](#custom-themes)
  - [Pages \& Navigation](#pages--navigation)
  - [API Routes](#api-routes)
    - [Authentication](#authentication)
    - [Spotify Integration](#spotify-integration)
    - [User Management](#user-management)
    - [Public Display](#public-display)
  - [Database](#database)
  - [Tech Stack](#tech-stack)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)

---

## Features

- Real-time Spotify listening activity display
- Custom URL slugs for personalized sharing
- Multiple pre-built themes and custom CSS support
- Privacy controls with public/private display modes
- OBS/streaming integration with transparent overlays
- Upload custom background images
- Mobile-responsive design with modern UI
- RESTful API for custom integrations
- Secure OAuth authentication with Spotify

---

## Display Types

### Now Playing

Real-time display of currently playing track with live progress updates, artist information, album artwork, and playback controls integration.

**Key Features:**
- Live progress bar with real-time updates every 5 seconds
- High-quality album artwork from Spotify
- Track metadata including artist, album, and duration
- Play/pause status indicators

### Recent Tracks

Configurable history display showing recently played tracks with detailed information and customizable list length (1-20 tracks).

**Key Features:**
- Chronological track history with timestamps
- Rich metadata for each track
- Configurable display count
- Album artwork thumbnails

### Custom Themes

Advanced theming system with multiple pre-built styles and full custom CSS injection support for power users.

**Key Features:**
- Multiple professionally designed themes
- Custom background image uploads
- Full CSS customization capabilities
- Streaming-optimized transparent overlays

---

## Pages & Navigation

- `/`
  **Home page**: Landing page with authentication and feature overview.

- `/login`
  **Authentication**: Spotify OAuth login and account connection.

- `/dashboard`
  **User dashboard**: Display settings, theme customization, privacy controls, and URL management.

- `/display/[identifier]`
  **Public display**: Real-time music display pages with custom styling and themes.

- `/leaderboard`
  **Community**: Public discovery of active displays and popular tracks.

- `/analytics`
  **Insights**: Usage analytics and listening statistics (authenticated users).

- `/admin`
  **Administration**: Admin panel for user management and system monitoring.

---

## API Routes

All API routes are under `/api/` and use Next.js Route Handlers with NextAuth.js authentication.

### Authentication

- `/api/auth/[...nextauth]`
  NextAuth.js authentication endpoints with Spotify OAuth provider.

### Spotify Integration

- `/api/spotify/current-track`
  Get currently playing track with real-time data.

- `/api/spotify/recent-tracks`
  Fetch recent listening history from Spotify API.

- `/api/spotify/refresh-token`
  Handle Spotify token refresh for continuous access.

### User Management

- `/api/user/preferences`
  Get and update user display preferences and privacy settings.

- `/api/user/generate-slug`
  Create custom URL slugs with availability checking.

- `/api/user/upload-background`
  Handle custom background image uploads.

### Public Display

- `/api/display/[identifier]`
  Public API endpoint for display data by custom identifier.

- `/api/public/leaderboard`
  Public leaderboard data for community features.

---

## Database

- **Collections:**
  - `users` (user accounts and preferences)
  - `accounts` (OAuth account connections)
  - `sessions` (authentication sessions)

- **Database:**
  Uses MongoDB with native driver for flexible document storage and efficient querying.

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js Route Handlers (API), MongoDB native driver
- **Authentication:** NextAuth.js with Spotify OAuth 2.0
- **State Management:** React Context API and custom hooks
- **Deployment:** Vercel with automatic CI/CD
- **Analytics:** Vercel Analytics and Speed Insights
- **Other:**
  - `nanoid` for URL slug generation
  - `date-fns` for date manipulation
  - `framer-motion` for animations
  - `lucide-react` for icons

---

## Development

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB database (local or Atlas)
- Spotify Developer App

### Setup

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local` and fill in required values:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/jamlog
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secure_random_string
   ```

3. **Set up Spotify Developer App:**
   - Create app at [Spotify Developer Dashboard](https://developer.spotify.com/)
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`

4. **Start development server:**
   ```sh
   pnpm dev
   ```

5. **Build for production:**
   ```sh
   pnpm build
   pnpm start
   ```
