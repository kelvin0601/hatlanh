import { ProductManager } from "@/components/admin/ProductManager";
import { readAdminStore } from "@/lib/admin-store";

export default async function AdminProductsPage() {
  return <ProductManager initialProducts={(await readAdminStore("catalog:write")).products} />;
}
