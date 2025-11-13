import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Only use Turbopack in development, not for builds
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      root: process.cwd(),
    },
  }),
  experimental: {
    // Ensure decorators work properly
    typedRoutes: true,
  },
};

export default nextConfig;
