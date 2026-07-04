import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  poweredByHeader: false,
  allowedDevOrigins: ['mac-mini.local', 'next.thomasbsgr.dev', "macbook.local", "100.99.17.32"],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
