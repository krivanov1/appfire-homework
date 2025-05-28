import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3001/:path*',
  //     },
  //   ]
  // },
  allowedDevOrigins: [
    "*.ngrok-free.app"
  ],
};

export default nextConfig;
