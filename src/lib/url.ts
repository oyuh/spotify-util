/**
 * Get the base URL for the application
 * Works in both client and server environments
 * Automatically detects Vercel deployment URLs
 */
export function getBaseUrl(): string {
  // Browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Vercel environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Custom domain in production
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  // NextAuth URL fallback
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Development fallback
  return 'http://localhost:3000';
}

/**
 * Get the domain name without protocol
 * Useful for display purposes
 */
export function getDomainName(): string {
  const baseUrl = getBaseUrl();
  return baseUrl.replace(/^https?:\/\//, '');
}
