import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { DotCarousel } from "@/components/ui/DotCarousel";
import { getStoreProducts } from "@/lib/admin-store";
import type { SiteContent } from "@/lib/site-content";

export async function ProductsSection({ content }: { content: SiteContent }) {
  const products = await getStoreProducts();
  return (
    <section className="overflow-hidden bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        {/* Section header */}
        <div className="flex items-start sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-3">
              {content.productsEyebrow}
            </p>
            <h2
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-section-title)",
              }}
            >
              {content.productsTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/san-pham"
              className="hidden sm:inline-flex items-center gap-1.5 text-forest font-semibold text-[14px] whitespace-nowrap hover:gap-2.5 transition-all"
            >
              Xem tất cả sản phẩm
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <DotCarousel label="Sản phẩm nổi bật">
            {products.map((product, index) => (
              <div
                key={product.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${products.length}`}
                className="min-w-0 shrink-0 grow-0 basis-[84%] pl-5"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </DotCarousel>
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {/* Mobile: Xem tất cả */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 text-forest font-semibold text-[15px]"
          >
            Xem tất cả sản phẩm
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group h-full overflow-hidden rounded-[14px] bg-paper transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="relative">
        <Link href={`/san-pham/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 767px) 84vw, (max-width: 1023px) 50vw, 25vw"
              className="object-cover transition-transform duration-[220ms] group-hover:scale-[1.025]"
            />
          </div>
        </Link>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-muted shadow-sm backdrop-blur-sm" aria-label="Sản phẩm được yêu thích">
          <Heart className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        </span>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="line-clamp-1 text-[16px] font-semibold leading-[1.35] text-ink transition-colors hover:text-forest">
            {product.name.replace("Ngũ cốc An Vị ", "")}
          </h3>
        </Link>
        <p className="line-clamp-1 text-[13px] leading-[1.4] text-muted">
          {product.description.split("—")[0].trim()}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-3 w-3 ${star <= 4 ? "fill-wheat text-wheat" : "fill-wheat/40 text-wheat/40"}`} />
            ))}
          </div>
          <span className="text-[12px] text-muted">4.8</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
          <span className="text-[16px] font-bold leading-[1.3] text-ink md:text-[18px]">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
