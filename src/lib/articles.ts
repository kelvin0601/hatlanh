export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  imageAlt: string;
  content: string;
}

export const articles: Article[] = [
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

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
