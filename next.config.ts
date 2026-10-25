import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const r2PublicUrl = process.env.R2_PUBLIC_URL?.trim();
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (r2PublicUrl) {
  try {
    const url = new URL(r2PublicUrl);
    if (url.protocol === "https:") {
      remotePatterns.push({
        protocol: "https",
        hostname: url.hostname,
        port: url.port,
        pathname: `${url.pathname.replace(/\/$/, "")}/**`,
        search: "",
      });
    }
  } catch {
    // The upload API reports an actionable configuration error at runtime.
  }
}
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  ...(!isDevelopment ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns,
    maximumRedirects: 0,
  },
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
  async headers() {
    const headers = [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=()" },
    ];
    if (!isDevelopment) headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
