import type { Metadata } from "next";
import { getStoreProducts } from "@/lib/admin-store";
import { ProductFilter } from "@/components/commerce/ProductFilter";

export const metadata: Metadata = {
  title: "Sản phẩm ngũ cốc thiên nhiên",
  keywords: ["ngũ cốc thiên nhiên", "ngũ cốc nguyên hạt", "An Vị"],
  description:
    "Khám phá các sản phẩm ngũ cốc thiên nhiên từ An Vị — nguyên hạt, dinh dưỡng, tốt cho sức khỏe gia đình bạn.",
  openGraph: {
    title: "Sản phẩm ngũ cốc thiên nhiên | An Vị",
    description: "Ngũ cốc thiên nhiên từ An Vị — nguyên hạt, dinh dưỡng, tốt cho sức khỏe.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sản phẩm ngũ cốc thiên nhiên | An Vị",
    description: "Ngũ cốc thiên nhiên từ An Vị — nguyên hạt, dinh dưỡng, tốt cho sức khỏe.",
  },
};

export default async function ProductListPage() {
  const products = await getStoreProducts();
  return (
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
            Ngũ cốc An Vị
          </h1>
          <p className="text-body text-[17px] leading-[1.65]">
            Mỗi gói ngũ cốc là sự kết hợp hài hòa từ nhiều loại hạt thiên nhiên, mang đến nguồn
            dinh dưỡng trọn vẹn cho bữa sáng mỗi ngày.
          </p>
        </div>

        <ProductFilter products={products} />
      </div>
    </section>
  );
}
