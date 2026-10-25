import { ProductManager } from "@/components/admin/ProductManager";
import { getProductCategories, getProductIngredients, readAdminStore } from "@/lib/admin-store";

export default async function AdminProductsPage() {
  const [store, categories, ingredients] = await Promise.all([
    readAdminStore("catalog:write"),
    getProductCategories(),
    getProductIngredients(),
  ]);
  return <ProductManager initialProducts={store.products} initialCategories={categories} initialIngredients={ingredients} />;
}
