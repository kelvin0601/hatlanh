import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, articles } from "../src/lib/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedProducts = [
  {
    slug: "ngu-coc-truyen-thong",
    name: "Ngũ cốc An Vị Truyền Thống",
    shortName: "Truyền Thống",
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
    slug: "ngu-coc-nang-luong",
    name: "Ngũ cốc An Vị Năng Lượng",
    shortName: "Năng Lượng",
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
    slug: "ngu-coc-dinh-duong",
    name: "Ngũ cốc An Vị Dinh Dưỡng",
    shortName: "Dinh Dưỡng",
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
    slug: "ngu-coc-nho-xinh",
    name: "Ngũ cốc An Vị Nhỏ Xinh",
    shortName: "Nhỏ Xinh",
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

const seedArticles = [
  {
    slug: "bua-sang-lanh-manh-voi-ngu-coc",
    title: "Bữa sáng lành mạnh với ngũ cốc — bắt đầu ngày mới đúng cách",
    excerpt: "Tìm hiểu cách kết hợp ngũ cốc cùng trái cây và sữa để có bữa sáng dinh dưỡng hoàn hảo.",
    category: "Dinh dưỡng",
    date: "2026-10-15",
    image: "/images/05_lifestyle/breakfast-banner-hd.jpg",
    imageAlt: "Bữa sáng ngũ cốc với trái cây trong ánh nắng sớm",
    content: `Một bữa sáng lành mạnh không cần cầu kỳ. Chỉ cần một tô ngũ cốc ấm, thêm chút trái cây tươi và sữa, bạn đã có đủ năng lượng cho cả buổi sáng.

## Tại sao nên ăn ngũ cốc vào buổi sáng?

Ngũ cốc cung cấp carbohydrate phức hợp, giúp duy trì năng lượng ổn định suốt buổi sáng. Chất xơ trong ngũ cốc hỗ trợ tiêu hóa và tạo cảm giác no lâu hơn.

## Cách kết hợp ngon miệng

- **Ngũ cốc + sữa tươi + chuối**: Đơn giản, bổ dưỡng
- **Ngũ cốc + sữa chua + dâu tây**: Thanh mát, giàu probiotics
- **Ngũ cốc + sữa hạt + mật ong**: Thơm ngọt tự nhiên

## Lưu ý khi chọn ngũ cốc

Ưu tiên ngũ cốc nguyên hạt, ít đường thêm vào. Kiểm tra thành phần trên bao bì để chọn sản phẩm phù hợp với nhu cầu dinh dưỡng của bạn.`,
  },
  {
    slug: "cach-bao-quan-ngu-coc",
    title: "Cách bảo quản ngũ cốc đúng cách để giữ trọn hương vị",
    excerpt: "Những mẹo đơn giản giúp ngũ cốc luôn thơm ngon và giữ được chất dinh dưỡng lâu hơn.",
    category: "Mẹo hay",
    date: "2026-10-10",
    image: "/images/04_products/product-traditional-hd.jpg",
    imageAlt: "Túi ngũ cốc được bảo quản trong không gian khô ráo",
    content: `Bảo quản ngũ cốc đúng cách giúp giữ được hương vị và chất dinh dưỡng lâu hơn. Dưới đây là những mẹo đơn giản mà hiệu quả.

## Nguyên tắc cơ bản

- Đậy kín bao bì sau mỗi lần sử dụng
- Tránh ánh nắng trực tiếp và nơi ẩm ướt
- Bảo quản ở nhiệt độ phòng, nơi khô ráo thoáng mát

## Dụng cụ bảo quản phù hợp

Hộp thủy tinh hoặc hộp nhựa có nắp kín là lựa chọn tốt nhất. Tránh dùng túi nilon thường vì không đảm bảo kín khí.

## Thời hạn sử dụng

Ngũ cốc An Vị có hạn sử dụng ghi rõ trên bao bì. Sau khi mở, nên dùng trong vòng 30 ngày để đảm bảo hương vị tốt nhất.`,
  },
  {
    slug: "5-cong-thuc-ngu-coc-don-gian",
    title: "5 công thức ngũ cốc đơn giản cho người bận rộn",
    excerpt: "Không có nhiều thời gian? Thử ngay 5 cách chế biến ngũ cốc nhanh gọn chỉ trong 5 phút.",
    category: "Công thức",
    date: "2026-10-05",
    image: "/images/04_products/product-nutrition-hd.jpg",
    imageAlt: "Bát ngũ cốc với quả mọng và các loại hạt",
    content: `Bận rộn không có nghĩa là phải bỏ qua bữa sáng. Với ngũ cốc An Vị, bạn có thể chuẩn bị bữa ăn dinh dưỡng chỉ trong vài phút.

## 1. Overnight oats

Ngâm ngũ cốc với sữa qua đêm trong tủ lạnh. Sáng ra thêm trái cây và dùng ngay — không cần nấu.

## 2. Ngũ cốc smoothie bowl

Xay ngũ cốc với chuối đông lạnh và sữa. Đổ ra tô, thêm topping yêu thích.

## 3. Ngũ cốc nóng nhanh

Cho ngũ cốc vào tô, thêm nước sôi, đậy nắp 3 phút. Thêm mật ong hoặc đường nâu.

## 4. Ngũ cốc trộn sữa chua

Trộn ngũ cốc với sữa chua Hy Lạp, thêm hạt và trái cây khô.

## 5. Energy balls

Trộn ngũ cốc với bơ đậu phộng và mật ong, vo viên và để tủ lạnh. Snack tiện lợi cả ngày.`,
  },
];

async function seed() {
  console.log("Seeding products...");
  await db.insert(products).values(seedProducts).onConflictDoNothing();

  console.log("Seeding articles...");
  await db.insert(articles).values(seedArticles).onConflictDoNothing();

  console.log("Seed complete!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
