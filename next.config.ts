import "./envConfig.ts";
import type { NextConfig } from "next";

const protocol = (process.env.FILE_PROTOCOL || "http") as "http" | "https";
const hostname = process.env.FILE_HOSTNAME || "localhost";
const port = process.env.FILE_PORT;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: protocol,
        hostname: hostname,
        port: port,
        pathname: "/file/**",
      },
    ],
  },
};

export default nextConfig;
