import type { NextConfig } from "next";

const nextConfig = {
  // Ensure Next picks this repo as the tracing root (avoids selecting a parent folder
  // when multiple lockfiles exist on disk).
  outputFileTracingRoot: __dirname,
  typescript: {
    // !! WARN !!
    // Ignoring build errors is dangerous, but we need this as a temporary workaround
    ignoreBuildErrors: true,
  },

  // Next 16 types may not expose this field yet; keep runtime config and widen typing.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blend-playlist-covers.spotifycdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "seeded-session-images.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dailymix-images.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "charts-images.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wrapped-images.spotifycdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thisis-images.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "newjams-images.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
} satisfies NextConfig & {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
};

export default nextConfig;
