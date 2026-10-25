import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getProductCategories, readAdminStore } from "@/lib/admin-store";

export default async function AdminProductCategoriesPage() {
  const [store, categories] = await Promise.all([
    readAdminStore("catalog:write"),
    getProductCategories(),
  ]);

  const items = categories.map((category) => ({ id: category.value, name: category.label, description: category.description, image: category.image, imageAlt: category.imageAlt, productCount: store.products.filter((product) => product.category === category.value).length }));
  return <TaxonomyManager kind="categories" initialItems={items} />;
}
