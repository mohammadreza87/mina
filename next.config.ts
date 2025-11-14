import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  // Turbopack configuration for TypeScript
  transpilePackages: [],
};

export default nextConfig;
