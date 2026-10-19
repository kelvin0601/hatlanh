import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thanh-toan", "/dat-hang-thanh-cong", "/tra-cuu-don-hang"],
      },
    ],
    sitemap: "https://hatlanh.vn/sitemap.xml",
  };
}
