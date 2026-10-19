"use client";

import Link from "next/link";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { products, formatPrice } from "@/lib/products";

export function ProductsSection() {
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
            <div className="hidden md:flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-sand transition-colors" aria-label="Trước">
                <ChevronLeft className="w-4 h-4 text-ink" />
              </button>
              <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-sand transition-colors" aria-label="Sau">
                <ChevronRight className="w-4 h-4 text-ink" />
              </button>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-paper rounded-[14px] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow group"
            >
              <Link href={`/san-pham/${product.slug}`} className="block relative">
                <div className="aspect-[4/5] bg-sand overflow-hidden">
                  <div
                    className="w-full h-full transition-transform duration-[220ms] group-hover:scale-[1.025]"
                    style={{
                      background: `radial-gradient(ellipse at 50% 60%, #EDE4D5 0%, #d4c9b5 50%, #c4b89a 100%)`,
                    }}
                  />
                </div>
                {/* Wishlist heart */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Yêu thích"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="w-4 h-4 text-muted" />
                </button>
              </Link>

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
                  <button
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-forest hover:bg-forest-hover text-white transition-colors"
                    aria-label={`Thêm ${product.name} vào giỏ`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
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
