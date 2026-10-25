import type { MetadataRoute } from "next";
import { policies } from "@/lib/policies";
import { getCategoryHref } from "@/lib/product-categories";
import { getProductCategories, getStoreArticles, getStoreProducts } from "@/lib/admin-store";

const BASE_URL = "https://anvi.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, categories] = await Promise.all([getStoreProducts(), getStoreArticles(), getProductCategories()]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/san-pham`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/cau-chuyen`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tu-nong-trai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/goc-song-lanh`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.filter((c) =>
    products.some((p) => p.category === c.value),
  ).map((c) => ({
    url: `${BASE_URL}${getCategoryHref(c.value)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/san-pham/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/goc-song-lanh/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const policyPages: MetadataRoute.Sitemap = policies.map((p) => ({
    url: `${BASE_URL}/chinh-sach/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...articlePages, ...policyPages];
}
