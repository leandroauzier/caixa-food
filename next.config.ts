import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
