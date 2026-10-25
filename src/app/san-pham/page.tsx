import type { Metadata } from "next";
import { getProductCategories, getProductIngredients, getStoreProducts } from "@/lib/admin-store";
import { ProductListing } from "@/components/commerce/ProductListing";

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
  const [products, categories, ingredients] = await Promise.all([getStoreProducts(), getProductCategories(), getProductIngredients()]);
  return (
    <ProductListing
      title="Ngũ cốc An Vị"
      description="Mỗi gói ngũ cốc là sự kết hợp hài hòa từ nhiều loại hạt thiên nhiên, mang đến nguồn dinh dưỡng trọn vẹn cho bữa sáng mỗi ngày."
      allProducts={products}
      categoryOptions={categories}
      ingredientOptions={ingredients}
    />
  );
}
