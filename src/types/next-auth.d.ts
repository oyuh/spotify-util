import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    spotifyId?: string
    userId?: string
    expiresAt?: number
  }

  interface User {
    id: string
    email?: string
    name?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    spotifyId?: string
    userId?: string
    expiresAt?: number
  }
}
