import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "https://c631618.parspack.net/c631618/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c631618.parspack.net",
        port: "",
        pathname: "/c631618/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/storage/**",
      },
    ],

    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.siemensplus1.ir", // آدرس سایت خودت رو اینجا بنویس
          },
        ],
        destination: "https://siemensplus1.ir/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
};

export default nextConfig;
