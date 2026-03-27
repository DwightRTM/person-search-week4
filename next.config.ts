import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack config for Next.js 16
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname),
    }
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
