import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { products, formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sản phẩm ngũ cốc thiên nhiên | Hạt Lành",
  description:
    "Khám phá các sản phẩm ngũ cốc thiên nhiên từ Hạt Lành — nguyên hạt, dinh dưỡng, tốt cho sức khỏe gia đình bạn.",
  openGraph: {
    title: "Sản phẩm ngũ cốc thiên nhiên | Hạt Lành",
    description: "Ngũ cốc thiên nhiên từ Hạt Lành — nguyên hạt, dinh dưỡng, tốt cho sức khỏe.",
    type: "website",
  },
};

export default function ProductListPage() {
  return (
    <>
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-2xl mb-10 md:mb-14">
            <h1
              className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
            >
              Ngũ cốc Hạt Lành
            </h1>
            <p className="text-body text-[17px] leading-[1.65]">
              Mỗi gói ngũ cốc là sự kết hợp hài hòa từ nhiều loại hạt thiên nhiên, mang đến nguồn
              dinh dưỡng trọn vẹn cho bữa sáng mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-paper rounded-[14px] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow group"
              >
                <Link href={`/san-pham/${product.slug}`} className="block">
                  <div className="aspect-[4/5] bg-sand flex items-center justify-center overflow-hidden">
                    <div className="text-center p-6 group-hover:scale-[1.025] transition-transform duration-[220ms]">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
                        <span className="text-3xl">🌾</span>
                      </div>
                      <p className="text-xs text-muted">Ảnh sản phẩm</p>
                    </div>
                  </div>
                </Link>

                <div className="p-4 md:p-5 flex flex-col gap-2">
                  <Link href={`/san-pham/${product.slug}`}>
                    <h2 className="text-ink font-semibold text-[18px] leading-[1.35] line-clamp-2 hover:text-forest transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-muted text-[14px] leading-[1.5] line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-muted text-[14px]">{product.weight}</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-ink text-[20px] font-bold leading-[1.3]">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-[14px] h-10 px-4 rounded-full transition-colors"
                      aria-label={`Thêm ${product.name} vào giỏ`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
