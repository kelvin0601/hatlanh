import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/product", destination: "/san-pham", permanent: true },
      { source: "/product/:slug", destination: "/san-pham/:slug", permanent: true },
      { source: "/blog", destination: "/goc-song-lanh", permanent: true },
      { source: "/blog/:slug", destination: "/goc-song-lanh/:slug", permanent: true },
      { source: "/contact-us", destination: "/lien-he", permanent: true },
    ];
  },
};

export default nextConfig;
