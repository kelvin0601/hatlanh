import type { ProductCategory } from "@/lib/product-categories";

export * from "@/lib/product-categories";

export type ProductType = "single" | "combo";

export interface ProductComboItem {
  productId: number;
  quantity: number;
}

export interface Product {
  id: number;
  type: ProductType;
  comboItems: ProductComboItem[];
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  weight: string;
  price: number;
  description: string;
  image: string;
  imageAlt: string;
  ingredients: string[];
  usage: string;
  storage: string;
}

export const products: Product[] = [
  {
    id: 1,
    type: "single",
    comboItems: [],
    slug: "ngu-coc-truyen-thong",
    name: "Ngũ cốc An Vị Truyền Thống",
    shortName: "Truyền Thống",
    category: "bua-sang-hang-ngay",
    weight: "500g",
    price: 185000,
    description: "Hỗn hợp yến mạch, gạo lứt, đậu đỏ và hạt sen — công thức cổ điển cho bữa sáng dinh dưỡng mỗi ngày.",
    image: "/images/04_products/product-traditional-hd.jpg",
    imageAlt: "Gói ngũ cốc An Vị Truyền Thống bên bát ngũ cốc nguyên hạt",
    ingredients: ["Yến mạch", "Gạo lứt", "Đậu đỏ", "Hạt sen", "Hạt kê"],
    usage: "Cho 3–4 muỗng ngũ cốc vào tô, thêm sữa nóng hoặc nước ấm, khuấy đều và thưởng thức. Có thể thêm trái cây tươi hoặc mật ong.",
    storage: "Bảo quản nơi khô ráo, thoáng mát. Đậy kín sau khi mở.",
  },
  {
    id: 2,
    type: "single",
    comboItems: [],
    slug: "ngu-coc-nang-luong",
    name: "Ngũ cốc An Vị Năng Lượng",
    shortName: "Năng Lượng",
    category: "nang-luong-van-dong",
    weight: "500g",
    price: 210000,
    description: "Yến mạch, hạt chia, hạnh nhân, hạt bí và óc chó — năng lượng dồi dào cho ngày dài hoạt động.",
    image: "/images/04_products/product-energy-hd.jpg",
    imageAlt: "Gói ngũ cốc An Vị Năng Lượng cùng các loại hạt dinh dưỡng",
    ingredients: ["Yến mạch", "Hạt chia", "Hạnh nhân", "Hạt bí", "Óc chó"],
    usage: "Dùng 3–4 muỗng với sữa tươi hoặc sữa hạt. Phù hợp cho bữa sáng hoặc bữa phụ buổi chiều.",
    storage: "Bảo quản nơi khô ráo, thoáng mát. Đậy kín sau khi mở.",
  },
  {
    id: 3,
    type: "single",
    comboItems: [],
    slug: "ngu-coc-dinh-duong",
    name: "Ngũ cốc An Vị Dinh Dưỡng",
    shortName: "Dinh Dưỡng",
    category: "dinh-duong-can-bang",
    weight: "350g",
    price: 165000,
    description: "Quinoa, hạt kê, hạt lanh, gạo lứt và đậu xanh — công thức cân bằng cho sức khỏe toàn diện.",
    image: "/images/04_products/product-nutrition-hd.jpg",
    imageAlt: "Gói ngũ cốc An Vị Dinh Dưỡng cạnh bát ngũ cốc và hạt",
    ingredients: ["Quinoa", "Hạt kê", "Hạt lanh", "Gạo lứt", "Đậu xanh"],
    usage: "Pha 3–4 muỗng với nước ấm hoặc sữa, khuấy đều. Có thể nấu cháo hoặc dùng như topping.",
    storage: "Bảo quản nơi khô ráo, thoáng mát. Đậy kín sau khi mở.",
  },
  {
    id: 4,
    type: "single",
    comboItems: [],
    slug: "ngu-coc-nho-xinh",
    name: "Ngũ cốc An Vị Nhỏ Xinh",
    shortName: "Nhỏ Xinh",
    category: "bua-sang-hang-ngay",
    weight: "200g",
    price: 98000,
    description: "Gói dùng thử — hỗn hợp ngũ cốc truyền thống, phù hợp để trải nghiệm lần đầu hoặc mang theo khi đi xa.",
    image: "/images/04_products/product-family-hd.jpg",
    imageAlt: "Sản phẩm ngũ cốc An Vị Nhỏ Xinh dành cho gia đình",
    ingredients: ["Yến mạch", "Gạo lứt", "Đậu đỏ", "Hạt sen", "Hạt kê"],
    usage: "Dùng trọn gói với sữa nóng hoặc nước ấm. Tiện lợi cho 3–4 bữa sáng.",
    storage: "Bảo quản nơi khô ráo, thoáng mát.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}
