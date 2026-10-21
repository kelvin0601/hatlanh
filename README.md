# An Vị

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
ORDER_FROM_EMAIL="An Vị <orders@your-verified-domain.com>"
STORE_NOTIFICATION_EMAIL=hello@your-domain.com
ADMIN_BOOTSTRAP_USERNAME="owner"
ADMIN_BOOTSTRAP_PASSWORD=""
ADMIN_SESSION_SECRET=""
```

`ORDER_FROM_EMAIL` phải thuộc domain đã xác minh trong Resend. Nếu chưa cấu hình, luồng đặt hàng vẫn chạy ở chế độ demo và UI sẽ báo rõ email chưa được gửi.

Trang quản trị nằm tại `/admin`. Tài khoản owner được tạo và băm bằng `scrypt` trong lần đăng nhập đầu tiên. Sau đó owner có thể tạo tài khoản riêng cho quản trị viên, biên tập viên và nhân viên xử lý đơn ở `/admin/nhan-su`.

Điền mật khẩu riêng có ít nhất 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Tạo `ADMIN_SESSION_SECRET` bằng `openssl rand -base64 48`; không dùng lại giá trị mẫu hoặc commit `.env.local`.

Session admin là token ngẫu nhiên, lưu bằng cookie `HttpOnly`, `SameSite=Strict`, hết hạn sau 8 giờ và có thể thu hồi khi đăng xuất. Mọi mutation admin đều kiểm tra role, Origin và CSRF token ở server.

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
- Admin có thể thêm, sửa, xóa sản phẩm và bài viết; xem đơn hàng, cập nhật trạng thái giao hàng và thanh toán.
- Các role hiện có: `owner`, `admin`, `editor`, `fulfillment`. Quyền luôn được kiểm tra ở API/DAL, không chỉ ẩn ở giao diện.
- API đặt hàng đối chiếu giá ở server, rate limit theo IP/thông tin khách và dùng idempotency key để tránh tạo trùng đơn.
- Dữ liệu và session hiện lưu tại `data/*.json`, phù hợp khi chạy local hoặc server có ổ đĩa ghi bền. Khi deploy serverless cần thay lớp lưu trữ bằng PostgreSQL/Supabase và rate limit bằng Redis/KV dùng chung.
