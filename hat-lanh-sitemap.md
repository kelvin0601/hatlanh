# Hạt Lành — Website Sitemap

> Phiên bản: 1.0 · Định hướng: Natural Cereal · Mobile-first · E-commerce + Brand Storytelling

## 1. Định hướng

- **Sản phẩm hiện tại:** Ngũ cốc thiên nhiên phối trộn từ nhiều loại hạt (thành phần thực tế theo từng SKU).
- **Thông điệp:** “Gieo hạt lành, dưỡng thân tâm.”
- **Trải nghiệm:** Hiện đại, thoáng, gần gũi; kể chuyện vùng quê và tinh thần sống an nhiên một cách ẩn ý, không mang màu sắc tôn giáo trực tiếp.
- **Media:** AI video autoplay, muted, playsInline; ưu tiên ảnh poster, tải theo viewport và hỗ trợ reduced motion.
- **Mục tiêu:** Dễ tìm sản phẩm, xem thông tin, thêm giỏ và thanh toán; đồng thời xây dựng niềm tin và nhận diện thương hiệu.

## 2. Sitemap tổng thể

```text
HẠT LÀNH /
├── Trang chủ /
│   ├── Hero video + CTA
│   ├── Những hạt lành từ đất trời
│   ├── Từ những miền quê bình dị
│   ├── Sản phẩm nổi bật
│   ├── Một chút an yên
│   ├── Giá trị & cam kết
│   ├── Góc sống lành
│   └── Newsletter + Footer
├── Sản phẩm /san-pham
│   ├── Danh sách sản phẩm + bộ lọc
│   ├── Danh mục (lọc theo query parameter)
│   ├── Chi tiết sản phẩm /san-pham/[slug]
│   └── Combo / quà tặng (danh mục khi có sản phẩm)
├── Câu chuyện Hạt Lành /cau-chuyen
│   ├── Khởi nguồn thương hiệu
│   ├── Triết lý sống lành
│   ├── Giá trị & cam kết
│   └── Con người phía sau
├── Từ nông trại /tu-nong-trai
│   ├── Các loại hạt / nguyên liệu
│   ├── Vùng nguyên liệu
│   ├── Hành trình sản xuất
│   └── Nguồn gốc & chất lượng
├── Góc sống lành /goc-song-lanh
│   ├── Kiến thức ngũ cốc
│   ├── Công thức món ăn
│   ├── Một chút an yên
│   ├── Chuyện từ quê nhà
│   └── Chi tiết bài viết /goc-song-lanh/[slug]
├── Liên hệ /lien-he
│   ├── Thông tin liên hệ
│   ├── Form gửi lời nhắn
│   ├── Hợp tác / phân phối
│   └── FAQ
└── E-commerce & hỗ trợ
    ├── Giỏ hàng /gio-hang
    ├── Thanh toán /thanh-toan
    ├── Xác nhận đơn hàng /dat-hang-thanh-cong
    ├── Tra cứu đơn hàng /tra-cuu-don-hang
    └── Chính sách /chinh-sach/[slug]
        ├── Hướng dẫn mua hàng
        ├── Giao hàng
        ├── Đổi trả
        ├── Bảo mật
        └── Điều khoản sử dụng
```

## 3. Main navigation

**Desktop:** Trang chủ · Sản phẩm · Câu chuyện · Từ nông trại · Góc sống lành · Liên hệ; bên phải có tìm kiếm, giỏ hàng và CTA “Mua ngay”.

**Mobile:** Logo · Giỏ hàng · Menu; menu mở dạng drawer chứa sáu mục chính. Đảm bảo CTA mua hàng luôn dễ tiếp cận.

## 4. Homepage — Thứ tự section

| # | Section | Nội dung | Media / tương tác | CTA |
|---|---|---|---|---|
| 01 | Hero — Từ muôn hạt thiên nhiên | Thông điệp chính, giới thiệu ngũ cốc | AI video autoplay, muted, loop | Khám phá sản phẩm / Câu chuyện |
| 02 | Những hạt lành từ đất trời | Các loại hạt thực sự có trong sản phẩm | Ảnh nguyên liệu, editorial layout | Khám phá nguyên liệu |
| 03 | Từ những miền quê bình dị | Câu chuyện thương hiệu, con người và vùng nguyên liệu | Video autoplay khi vào viewport | Xem câu chuyện |
| 04 | Ngũ cốc cho mỗi ngày | Sản phẩm nổi bật, giá, thành phần chính, quick add | Product cards / carousel mobile | Xem tất cả sản phẩm |
| 05 | Một chút an yên | Bữa sáng và lối sống chậm | Video lifestyle autoplay | Khám phá công thức |
| 06 | Lành từ gốc, tốt cho bạn | Cam kết có thể kiểm chứng về nguyên liệu, quy trình, nguồn gốc | Icon + thông tin ngắn | Tìm hiểu thêm |
| 07 | Chuyện hạt lành, chuyện sống an | Blog, công thức, kiến thức và chuyện quê | Editorial article cards | Xem bài viết |
| 08 | Newsletter & Footer | Đăng ký nhận tin, thông tin, chính sách | Form + navigation | Đăng ký |

## 5. Danh sách URL

| Trang | URL | Ghi chú |
|---|---|---|
| Trang chủ | `/` | Storytelling + sản phẩm |
| Tất cả sản phẩm | `/san-pham` | Danh sách và lọc |
| Danh mục | `/san-pham?category=[slug]` | Không cần trang tĩnh riêng |
| Chi tiết sản phẩm | `/san-pham/[slug]` | SKU, giá, thành phần, mua hàng |
| Câu chuyện | `/cau-chuyen` | Thương hiệu |
| Từ nông trại | `/tu-nong-trai` | Nguồn gốc thực tế |
| Góc sống lành | `/goc-song-lanh` | Blog |
| Chi tiết bài viết | `/goc-song-lanh/[slug]` | SEO |
| Liên hệ | `/lien-he` | Form và hỗ trợ |
| Giỏ hàng | `/gio-hang` | E-commerce |
| Thanh toán | `/thanh-toan` | E-commerce |
| Xác nhận đơn | `/dat-hang-thanh-cong` | Sau checkout |
| Tra cứu đơn | `/tra-cuu-don-hang` | Hỗ trợ sau mua |
| Chính sách | `/chinh-sach/[slug]` | Giao hàng, đổi trả, bảo mật... |

## 6. Ưu tiên triển khai

### Phase 1 — MVP

- Trang chủ
- Danh sách sản phẩm và chi tiết sản phẩm
- Giỏ hàng, thanh toán, xác nhận đơn
- Câu chuyện thương hiệu
- Liên hệ, FAQ cơ bản, chính sách
- Nội dung nguồn gốc và nguyên liệu lồng ghép vào Homepage / Câu chuyện

### Phase 2 — Mở rộng

- Trang Từ nông trại chuyên sâu khi có đủ dữ liệu và hình ảnh thực tế
- Góc sống lành với bài viết và công thức đều đặn
- Đánh giá khách hàng xác thực
- Combo, mua lại, chương trình khách hàng thân thiết
- Tài khoản khách hàng nếu cần

## 7. Quy tắc UX & nội dung

1. **Mobile-first:** chữ body tối thiểu 16px, CTA cao khoảng 52px, khoảng chạm tối thiểu 44×44px; không thu nhỏ nguyên layout desktop.
2. **Commerce first:** từ Hero có đường dẫn trực tiếp đến sản phẩm; thông tin giá, thành phần, khối lượng và cách sử dụng phải rõ ràng.
3. **Video không chặn mua hàng:** autoplay tắt tiếng; dùng poster fallback, lazy load video ngoài Hero; hỗ trợ `prefers-reduced-motion`.
4. **Không thổi phồng:** không tự khẳng định organic, không chất bảo quản, công dụng chữa bệnh hoặc nguồn gốc cụ thể nếu chưa có chứng cứ.
5. **Nhất quán:** tuân theo `design.md` và `design-mobile.md` cho typography, màu, spacing, grid, responsive và motion.

---

*Ghi chú: Danh mục sản phẩm, thành phần, giá, thông tin vùng nguyên liệu và chính sách cần được cập nhật theo dữ liệu kinh doanh thực tế.*
