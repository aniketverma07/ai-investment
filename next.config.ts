import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['localhost', '127.0.0.1'],
  },
};

export default nextConfig;
