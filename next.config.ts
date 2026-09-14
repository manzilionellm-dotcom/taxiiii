import type { NextConfig } from "next";
import { PRIVATE_CACHE, SECURITY_HEADERS } from "./lib/protect/constants";

const nextConfig: NextConfig = {
  transpilePackages: ["@capacitor/haptics", "@capacitor/core"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: PRIVATE_CACHE }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: PRIVATE_CACHE }],
      },
    ];
  },
};

export default nextConfig;
