import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "drive.google.com"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
}

export default nextConfig
