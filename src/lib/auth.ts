import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import { createDefaultUserPreferences } from "./db"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

// Define scopes for Spotify API access
const spotifyScopes = [
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  "user-read-playback-state"
].join(" ")

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: spotifyScopes,
        },
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
      return session
    },
    async signIn({ user, account }) {
      console.log('SignIn callback - user:', user)
      console.log('SignIn callback - account:', account)
      if (account?.provider === "spotify" && user.id && account.providerAccountId) {
        // Create default user preferences when they sign in for the first time
        try {
          await createDefaultUserPreferences(user.id, account.providerAccountId)
        } catch (error) {
          console.error("Error creating default user preferences:", error)
        }
      }
      return true
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
}

export default NextAuth(authOptions)
