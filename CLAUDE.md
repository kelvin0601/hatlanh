# Hạt Lành — Project Rules

## SEO (Luôn ưu tiên cao nhất)

- Mỗi trang PHẢI có metadata riêng (title, description, keywords) bằng tiếng Việt, sử dụng Next.js `generateMetadata` hoặc `export const metadata`.
- Title format: `Tên trang | Hạt Lành — Ngũ cốc thiên nhiên`
- Luôn dùng semantic HTML: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`.
- Mỗi trang chỉ có 1 `<h1>`. Heading hierarchy phải đúng thứ tự (h1 → h2 → h3).
- Trang sản phẩm phải có JSON-LD structured data (Product schema).
- Trang blog phải có JSON-LD structured data (Article schema).
- Tất cả hình ảnh phải có `alt` text mô tả bằng tiếng Việt.
- Sử dụng `next/image` cho tất cả hình ảnh — không dùng `<img>` trực tiếp.
- Internal linking giữa các trang liên quan (sản phẩm ↔ blog, homepage → danh mục).
- URL phải sạch, tiếng Việt không dấu, dùng dấu gạch ngang: `/san-pham/ngu-coc-truyen-thong`.
- Tạo sitemap.xml và robots.txt tự động.
- Mỗi trang phải có Open Graph và Twitter Card metadata.

## Performance (Luôn ưu tiên cao nhất)

- Mặc định dùng Server Components. Chỉ thêm `"use client"` khi thực sự cần interactivity.
- Lazy load tất cả nội dung below-the-fold: images, videos, components.
- Video: `preload="none"` cho below-fold, poster bắt buộc, IntersectionObserver để pause khi offscreen.
- Font: đã load với `font-display: swap` qua `next/font/google`. Không thêm font khác.
- Không import thư viện lớn ở client side nếu không cần.
- Tối ưu bundle: dynamic import cho components nặng.
- Images: dùng `priority` chỉ cho hero/LCP image, còn lại để lazy load mặc định.
- CSS: dùng Tailwind utility classes, tránh CSS-in-JS runtime.
- Tránh layout shift: luôn set width/height hoặc aspect-ratio cho media.
- Target Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Code Style

- TypeScript strict cho tất cả files.
- Component names: PascalCase. File names: PascalCase cho components, kebab-case cho routes.
- Không comment thừa. Code phải tự giải thích.
- Design tokens từ `globals.css` — không hardcode colors/spacing.
- Mobile-first: viết CSS mobile trước, dùng `md:` và `lg:` breakpoints để scale up.
- Vietnamese content: dùng `lang="vi"`, tránh uppercase dài cho tiếng Việt có dấu.

## Project Structure

```
src/
  app/                    # Routes (Next.js App Router)
  components/
    layout/               # Header, Footer, Navigation
    sections/             # Homepage sections
    ui/                   # Reusable UI components (Button, Card, etc.)
  lib/                    # Utilities, data, types
  types/                  # TypeScript type definitions
public/
  images/                 # Static images
docs/                     # Design specs (không deploy)
```
