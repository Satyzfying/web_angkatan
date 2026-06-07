import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '/members': [
      'src/components/molecules/members/**/*.{gif,jpeg,jpg,mp3,mp4,otf,png,ttf,webp}',
      'src/components/molecules/members/**/bgMusic.ts'
    ]
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 220, 256, 320, 384, 440, 514],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.terminaltrove.com',
        pathname: '/m/**'
      }
    ]
  }
}

export default nextConfig
