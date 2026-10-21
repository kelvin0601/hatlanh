import { getStoreProducts } from "@/lib/admin-store";
import { Header } from "@/components/layout/Header";

export async function SiteHeader() {
  const products = await getStoreProducts();
  return <Header products={products} />;
}
