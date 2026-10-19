import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { products, getProductBySlug, formatPrice } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Sản phẩm không tồn tại | Hạt Lành" };

  return {
    title: `${product.name} | Hạt Lành`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Hạt Lành`,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <div className="aspect-square rounded-2xl bg-sand flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                  <span className="text-4xl">🌾</span>
                </div>
                <p className="text-sm text-muted">Ảnh sản phẩm {product.name}</p>
              </div>
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

              <button className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors w-full sm:w-fit">
                <ShoppingBag className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>

              <div className="border-t border-border pt-6 flex flex-col gap-5">
                <div>
                  <h2 className="text-ink font-semibold text-[17px] mb-2">Thành phần</h2>
                  <ul className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <li
                        key={ing}
                        className="bg-sand text-body text-[14px] px-3 py-1.5 rounded-full"
                      >
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
        </div>
      </section>
    </>
  );
}
