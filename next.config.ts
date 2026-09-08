import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Wide open on purpose: place images are hand-picked from arbitrary
    // sites (TripAdvisor, Unsplash, Wikimedia, ...) via the admin form, so
    // pinning specific hostnames here means every new source needs a code
    // change first. Any https host is allowed instead.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
