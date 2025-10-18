import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://www.chess.com/bundles/web/images/**')],
  },
};

export default nextConfig;
