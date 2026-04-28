import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 4,
    staticGenerationMinPagesPerWorker: 25,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
