import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.82",
        port: "8080",
        pathname: "/file/**"
      }
    ]
  }
};

export default nextConfig;
