import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getProductIngredients, readAdminStore } from "@/lib/admin-store";

export default async function AdminProductIngredientsPage() {
  const [store, ingredients] = await Promise.all([
    readAdminStore("catalog:write"),
    getProductIngredients(),
  ]);

  const items = ingredients.map((ingredient) => ({ id: ingredient.name, name: ingredient.name, image: ingredient.image, imageAlt: ingredient.imageAlt, productCount: store.products.filter((product) => product.ingredients.includes(ingredient.name)).length }));
  return <TaxonomyManager kind="ingredients" initialItems={items} />;
}
