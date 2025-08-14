import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import { createDefaultUserPreferences } from "./db"
import getClientPromise from "./db"

const clientPromise = getClientPromise()

/**
 * Enhanced Spotify OAuth Configuration
 *
 * Key improvements for token reliability:
 * - Comprehensive scope requests to ensure all necessary permissions
 * - Force approval dialog to ensure users see all permissions
 * - Enhanced logging to track scope grants and token issues
 * - Graceful token refresh handling
 * - Proper error handling for expired/revoked tokens
 */

// Function to refresh the access token
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// Define comprehensive scopes for Spotify API access
// These scopes ensure the app can access all necessary user data
const spotifyScopes = [
  // Basic user information
  "user-read-email",           // Access user's email address
  "user-read-private",         // Access user's display name, country, etc.

  // Playback information (core functionality)
  "user-read-currently-playing", // Read currently playing track
  "user-read-recently-played",   // Read recently played tracks
  "user-read-playback-state",    // Read playback state (playing/paused/device info)

  // Additional user data
  "user-top-read",             // Read user's top artists/tracks
  "user-library-read",         // Read saved tracks/albums (optional but useful)
  "playlist-read-private",     // Read user's private playlists (optional)
  "playlist-read-collaborative" // Read collaborative playlists (optional)
].join(" ")

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "spotify-util" // Ensure NextAuth uses the spotify-util database
  }),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: spotifyScopes,
          // Force approval prompt to ensure users see and grant all permissions
          show_dialog: "true", // This ensures users always see the permission dialog
        },
      },
      // Ensure we get all the profile information we need
      profile(profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
          // Store additional Spotify-specific data
          spotifyId: profile.id,
          country: profile.country,
          followers: profile.followers?.total,
          product: profile.product, // Spotify subscription type (free/premium)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        console.log('JWT callback - account:', account)
        console.log('JWT callback - user:', user)
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.spotifyId = account.providerAccountId
        token.expiresAt = account.expires_at
      }

      if (user) {
        token.userId = user.id
      }

      // Check if token is expired and refresh it
      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000) {
        console.log('Token expired, refreshing...')
        try {
          const refreshedToken = await refreshAccessToken(token)
          console.log('Token refreshed successfully')
          return refreshedToken
        } catch (error) {
          console.error('Error refreshing token:', error)
          // Return the old token, but user will need to re-authenticate
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      console.log('Session callback - token:', token)
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.spotifyId = token.spotifyId as string
      session.userId = token.userId as string
      session.expiresAt = token.expiresAt as number

      console.log('Session callback - final session:', session)

      // CRITICAL FIX: Create user preferences HERE instead of in signIn callback
      // This ensures the account is fully created in MongoDB first
      if (session.userId && session.spotifyId) {
        try {
          const { createDefaultUserPreferences } = await import("@/lib/db")
          await createDefaultUserPreferences(session.userId, session.spotifyId)
          console.log('✅ User preferences created/validated in session callback')
        } catch (error) {
          console.error("❌ Error creating user preferences in session callback:", error)
        }
      }

      return session
    },
    async signIn({ user, account }) {
      console.log('=== SignIn Callback Started ===')
      console.log('SignIn callback - user:', user)
      console.log('SignIn callback - account:', account)

      if (account?.provider === 'spotify') {
        console.log('🎵 Spotify OAuth successful!')
        console.log('✅ Granted scopes:', account.scope || 'No scope info available')
        console.log('🔑 Access token length:', account.access_token?.length || 0)
        console.log('🔄 Refresh token present:', !!account.refresh_token)
        console.log('⏰ Token expires at:', account.expires_at ? new Date(account.expires_at * 1000).toISOString() : 'No expiry info')

        // Log if any required scopes are missing
        const requiredScopes = spotifyScopes.split(' ')
        const grantedScopes = account.scope?.split(' ') || []
        const missingScopes = requiredScopes.filter(scope => !grantedScopes.includes(scope))

        if (missingScopes.length > 0) {
          console.warn('⚠️ Missing required scopes:', missingScopes)
        } else {
          console.log('✅ All required scopes granted!')
        }
      }

      // Just allow the sign-in, user preferences will be created in session callback
      console.log('=== SignIn Callback Completed ===')
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  debug: true, // Enable debug logs temporarily
  trustHost: true, // Trust the host for custom domains
}

export default NextAuth(authOptions)
