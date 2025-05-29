import "./envConfig.ts";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.my-menu.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
