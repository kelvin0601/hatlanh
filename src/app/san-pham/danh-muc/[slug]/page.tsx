import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductCategories, getProductIngredients, getStoreProductCategory, getStoreProducts } from "@/lib/admin-store";
import { getCategoryHref } from "@/lib/product-categories";
import { ProductListing } from "@/components/commerce/ProductListing";

const BASE_URL = "https://anvi.vn";

export async function generateStaticParams() {
  return (await getProductCategories()).map((category) => ({ slug: category.value }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getStoreProductCategory(slug);
  if (!category) return { title: "Danh mục không tồn tại" };

  const title = `Ngũ cốc ${category.label.toLowerCase()}`;
  return {
    title,
    description: category.description,
    keywords: [category.label, "ngũ cốc thiên nhiên", "ngũ cốc nguyên hạt", "An Vị"],
    alternates: { canonical: getCategoryHref(category.value) },
    openGraph: {
      title: `${title} | An Vị`,
      description: category.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | An Vị`,
      description: category.description,
    },
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, products, categories, ingredients] = await Promise.all([
    getStoreProductCategory(slug),
    getStoreProducts(),
    getProductCategories(),
    getProductIngredients(),
  ]);
  if (!category) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${BASE_URL}/san-pham` },
      { "@type": "ListItem", position: 3, name: category.label, item: `${BASE_URL}${getCategoryHref(category.value)}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductListing
        title={category.label}
        description={category.description}
        allProducts={products}
        categoryOptions={categories}
        ingredientOptions={ingredients}
        activeCategory={category.value}
        eyebrow={
          <nav aria-label="Breadcrumb" className="mb-4 text-[13px] text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="link-underline hover:text-ink">Trang chủ</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/san-pham" className="link-underline hover:text-ink">Sản phẩm</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink font-medium">{category.label}</li>
            </ol>
          </nav>
        }
      />
    </>
  );
}
