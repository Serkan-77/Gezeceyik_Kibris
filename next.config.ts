import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow external placeholder images during development.
    // In production, replace with locally hosted or CDN-served images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;
