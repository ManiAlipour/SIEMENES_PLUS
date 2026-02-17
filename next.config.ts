import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.c2.liara.space",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "storage.liara.space",
        pathname: "**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
