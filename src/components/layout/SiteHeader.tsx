import { getProductCategories, getStoreProducts } from "@/lib/admin-store";
import { Header } from "@/components/layout/Header";

export async function SiteHeader() {
  const [products, categories] = await Promise.all([getStoreProducts(), getProductCategories()]);
  return <Header products={products} categories={categories} />;
}
