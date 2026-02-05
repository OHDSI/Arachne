/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

const isStaticExport = process.env.BUILD_STATIC === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  // Static export for Maven/JAR packaging (no rewrites supported)
  ...(isStaticExport && { output: "export" }),
  // Proxy /api in dev only (rewrites not allowed with output: 'export')
  ...(!isStaticExport && {
    async rewrites() {
      const target = process.env.PROXY_HOST || "http://localhost:8880";
      return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
    },
  }),
  transpilePackages: [],
  webpack(config) {
    // Use SVGR for .svg imports (default = React component, use ?url for URL)
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      config.module.rules.push(
        { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
        {
          test: /\.svg$/i,
          resourceQuery: { not: [/url/] },
          use: ["@svgr/webpack"],
        }
      );
      fileLoaderRule.exclude = /\.svg$/i;
    }
    return config;
  },
};

module.exports = nextConfig;
