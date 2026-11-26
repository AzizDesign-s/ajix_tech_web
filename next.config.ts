import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Tool/brand icons are served from public/icons/tools, so no external image
    // host is needed for those. The one remote host allowed is Sanity's asset
    // CDN, scoped to this project's asset path so a stray <Image> pointing at
    // any other origin still fails loudly in review.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
