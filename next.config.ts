import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets a second server (e.g. a dev preview beside `next start`) build into its own folder
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
