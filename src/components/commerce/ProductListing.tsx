import { Suspense, type ReactNode } from "react";
import type { Product } from "@/lib/products";
import type { ProductCategory, ProductCategoryDefinition } from "@/lib/product-categories";
import type { ProductIngredientDefinition } from "@/lib/product-ingredients";
import { ProductFilter } from "@/components/commerce/ProductFilter";

type ProductListingProps = {
  title: string;
  description: ReactNode;
  allProducts: Product[];
  categoryOptions: ProductCategoryDefinition[];
  ingredientOptions: ProductIngredientDefinition[];
  activeCategory?: ProductCategory;
  eyebrow?: ReactNode;
};

export function ProductListing({ title, description, allProducts, categoryOptions, ingredientOptions, activeCategory, eyebrow }: ProductListingProps) {
  const categories = categoryOptions.filter((category) =>
    allProducts.some((product) => product.category === category.value),
  );
  const products = allProducts;

  return (
    <section className="bg-cream" style={{ paddingTop: "var(--hero-space)", paddingBottom: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="max-w-2xl mb-10 md:mb-14">
          {eyebrow}
          <h1
            className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
          >
            {title}
          </h1>
          <p className="text-body text-[17px] leading-[1.65]">{description}</p>
        </div>

        <Suspense fallback={null}>
          <ProductFilter products={products} categories={categories} ingredients={ingredientOptions} activeCategory={activeCategory} />
        </Suspense>
      </div>
    </section>
  );
}
