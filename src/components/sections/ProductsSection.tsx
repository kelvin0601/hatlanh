import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { getStoreProducts } from "@/lib/admin-store";

export async function ProductsSection() {
  const products = await getStoreProducts();
  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        {/* Section header */}
        <div className="flex items-start sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-3">
              Sản phẩm nổi bật
            </p>
            <h2
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              }}
            >
              Ngũ cốc cho một cuộc sống lành mạnh
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

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-paper rounded-[14px] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow group"
            >
              <div className="relative">
                <Link href={`/san-pham/${product.slug}`} className="block">
                  <div className="relative aspect-[4/5] bg-sand overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 1023px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[220ms] group-hover:scale-[1.025]"
                    />
                  </div>
                </Link>
                {/* Wishlist heart */}
                  <span
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 text-muted backdrop-blur-sm flex items-center justify-center shadow-sm"
                    aria-label="Sản phẩm được yêu thích"
                  >
                    <Heart className="w-4 h-4 transition-all duration-300 group-hover/heart:scale-110 group-hover/heart:fill-white" />
                  </span>
              </div>

              <div className="p-3 md:p-4 flex flex-col gap-1">
                <Link href={`/san-pham/${product.slug}`}>
                  <h3 className="text-ink font-semibold text-[15px] md:text-[16px] leading-[1.35] line-clamp-1 hover:text-forest transition-colors">
                    {product.name.replace("Ngũ cốc Hạt Lành ", "")}
                  </h3>
                </Link>
                <p className="text-muted text-[13px] leading-[1.4] line-clamp-1">
                  {product.description.split("—")[0].trim()}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= 4 ? "text-wheat fill-wheat" : "text-wheat/40 fill-wheat/40"}`}
                      />
                    ))}
                  </div>
                  <span className="text-muted text-[12px]">4.8</span>
                </div>

                {/* Price + cart */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                  <span className="text-ink text-[16px] md:text-[18px] font-bold leading-[1.3]">
                    {formatPrice(product.price)}
                  </span>
                  <AddToCartButton product={product} compact />
                </div>
              </div>
            </article>
          ))}
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
