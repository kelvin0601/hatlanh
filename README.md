# Hạt Lành

Website bán ngũ cốc thiên nhiên xây dựng bằng Next.js 16, React 19 và Tailwind CSS 4.

## Chạy local

```bash
npm ci
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Email đơn hàng và liên hệ

Sao chép `.env.example` thành `.env.local`, sau đó điền:

```bash
RESEND_API_KEY=re_xxxxxxxxx
ORDER_FROM_EMAIL="Hạt Lành <orders@your-verified-domain.com>"
STORE_NOTIFICATION_EMAIL=hello@your-domain.com
ADMIN_PASSWORD="change-this-strong-password"
ADMIN_SESSION_SECRET="generate-a-long-random-secret"
```

`ORDER_FROM_EMAIL` phải thuộc domain đã xác minh trong Resend. Nếu chưa cấu hình, luồng đặt hàng vẫn chạy ở chế độ demo và UI sẽ báo rõ email chưa được gửi.

Trang quản trị nằm tại `/admin`. Hai biến `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET` bắt buộc phải được cấu hình trước khi đăng nhập.

## Kiểm tra

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Luồng thương mại

- Giỏ hàng và các đơn gần đây được lưu trên trình duyệt.
- API tạo đơn luôn đối chiếu lại sản phẩm và giá ở server.
- Email khách hàng và email cửa hàng được gửi song song qua Resend.
- COD và chuyển khoản thủ công đã sẵn sàng. Cổng thanh toán online cần tích hợp thêm nhà cung cấp và webhook theo tài khoản merchant của cửa hàng.
- Admin có thể thêm, sửa, xóa sản phẩm và bài viết; xem đơn hàng và cập nhật trạng thái.
- Dữ liệu admin hiện lưu tại `data/store.json`, phù hợp khi chạy local hoặc server có ổ đĩa ghi bền. Khi deploy serverless cần thay lớp `admin-store.ts` bằng PostgreSQL, Supabase hoặc database tương đương.
