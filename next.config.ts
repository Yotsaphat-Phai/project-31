import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ให้มือถือในวง LAN เปิด dev server ได้ (เช่น https://192.168.1.241:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
