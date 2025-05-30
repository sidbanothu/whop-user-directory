import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
			"rpfwu8mbbcc8d8ma2ys9.apps.whop.com"

      ]
    }
  }
};

export default nextConfig;




