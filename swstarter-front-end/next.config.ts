import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://swstarter-backend:8000/api/v1/:path*",
      },
      {
        source: "/events/:path*",
        destination: "http://swstarter-backend:8000/api/v1/events/:path*",
      },
    ];
  },
};

export default nextConfig;
