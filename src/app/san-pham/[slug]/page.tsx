import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductCard } from "@/components/commerce/ProductCard";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/admin-store";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);
  if (!product) return { title: "Sản phẩm không tồn tại" };

  return {
    title: product.name,
    description: product.description,
    keywords: [product.name, ...product.ingredients, "ngũ cốc thiên nhiên"],
    openGraph: {
      title: `${product.name} | An Vị`,
      description: product.description,
      type: "website",
      images: [{ url: product.image, alt: product.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | An Vị`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);
  if (!product) notFound();
  const catalog = await getStoreProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 text-forest font-medium text-sm mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Tất cả sản phẩm
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="relative aspect-square rounded-2xl bg-sand overflow-hidden md:sticky md:top-[calc(var(--header-height)+24px)]">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h1
                  className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-3"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
                >
                  {product.name}
                </h1>
                <p className="text-muted text-[14px]">{product.weight}</p>
              </div>

              <p className="text-ink text-[28px] font-bold">{formatPrice(product.price)}</p>

              <p className="text-body text-[17px] leading-[1.65]">{product.description}</p>

              <AddToCartButton
                product={product}
                className="w-full sm:w-fit"
              />

              <div className="grid grid-cols-1 gap-3 rounded-[14px] bg-paper p-4 sm:grid-cols-3">
                {[
                  { icon: Truck, text: "Giao hàng toàn quốc" },
                  { icon: PackageCheck, text: "Đóng gói cẩn thận" },
                  { icon: ShieldCheck, text: "Thanh toán an toàn" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[13px] font-medium text-body">
                    <Icon className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 flex flex-col gap-5">
                <div>
                  <h2 className="text-ink font-semibold text-[17px] mb-2">Thành phần</h2>
                  <ul className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <li
                        key={ing}
                        className="flex items-center gap-1.5 bg-sand text-body text-[14px] px-3 py-1.5 rounded-full"
                      >
                        <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-ink font-semibold text-[17px] mb-2">Cách dùng</h2>
                  <p className="text-body text-[16px] leading-[1.65]">{product.usage}</p>
                </div>

                <div>
                  <h2 className="text-ink font-semibold text-[17px] mb-2">Bảo quản</h2>
                  <p className="text-body text-[16px] leading-[1.65]">{product.storage}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16 border-t border-border pt-12 md:mt-24 md:pt-16" aria-labelledby="related-products">
            <h2 id="related-products" className="mb-8 text-2xl font-medium text-ink">
              Có thể bạn cũng thích
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.filter((item) => item.id !== product.id).slice(0, 3).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
