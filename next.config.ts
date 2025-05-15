import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.1.34:3000'],
  },
};

export default nextConfig;
