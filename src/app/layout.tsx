import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpotifyUtil",
  description: "Create beautiful, customizable displays of your Spotify activity. Perfect for streamers, music lovers, and anyone who wants to share their musical journey.",
  icons: [
    { rel: 'icon', url: '/spotify-favicon.svg', type: 'image/svg+xml' },
  ],
  themeColor: '#1DB954',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Providers>
          <Analytics />
          <SpeedInsights />
          <Navigation />
          <main>
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
