export interface ProductCategoryDefinition {
  value: string;
  label: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryDefinition[] = [
  {
    value: "bua-sang-hang-ngay",
    label: "Bữa sáng hằng ngày",
    description: "Ngũ cốc nguyên hạt mộc mạc, dễ ăn — khởi đầu ngày mới nhẹ nhàng và đủ đầy cho cả gia đình.",
  },
  {
    value: "nang-luong-van-dong",
    label: "Năng lượng & vận động",
    description: "Kết hợp yến mạch cùng các loại hạt giàu đạm và chất béo tốt — tiếp sức cho ngày dài năng động.",
  },
  {
    value: "dinh-duong-can-bang",
    label: "Dinh dưỡng cân bằng",
    description: "Công thức hài hòa từ quinoa, hạt kê, hạt lanh và đậu — bổ sung dưỡng chất toàn diện mỗi ngày.",
  },
] as const;

export type ProductCategory = string;

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "bua-sang-hang-ngay";

export function isProductCategory(value: unknown): value is ProductCategory {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function getProductCategory(value: string, categories: ProductCategoryDefinition[] = PRODUCT_CATEGORIES) {
  return categories.find((category) => category.value === value);
}

export function getCategoryLabel(value: ProductCategory, categories: ProductCategoryDefinition[] = PRODUCT_CATEGORIES): string {
  return getProductCategory(value, categories)?.label ?? value;
}

export function getCategoryHref(value: ProductCategory): string {
  return `/san-pham/danh-muc/${value}`;
}
