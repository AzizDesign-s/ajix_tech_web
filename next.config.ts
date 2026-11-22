import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Tool/brand icons are now served from public/icons/tools, so no external
    // image host is needed. Keeping remotePatterns empty means an accidental
    // remote <Image> src fails loudly in review instead of silently adding a
    // third-party request in production.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
