# Cấu hình Cloudflare R2 cho ảnh admin

Admin tải ảnh lên R2 qua server Next.js. Khóa bí mật không được gửi xuống trình duyệt và bucket không cần cấu hình CORS cho luồng upload này.

## 1. Chuẩn bị trên Cloudflare

1. Tạo một R2 bucket.
2. Bật public access bằng custom domain (khuyến nghị) hoặc URL `r2.dev` của bucket.
3. Trong **R2 > Manage API Tokens**, tạo token giới hạn cho đúng bucket với quyền **Object Read & Write**.
4. Lưu lại **Access Key ID**, **Secret Access Key**, **Account ID**, tên bucket và public URL. Cloudflare chỉ hiển thị secret một lần.

## 2. Biến môi trường

Điền các giá trị sau trong `.env.local` khi chạy local và trong môi trường deploy:

```dotenv
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="an-vi-images"
R2_PUBLIC_URL="https://images.example.com"
R2_UPLOAD_PREFIX="images"
```

`R2_PUBLIC_URL` không có dấu `/` ở cuối. Đây phải là URL public đọc được ảnh, không phải endpoint S3 `r2.cloudflarestorage.com`.

Khởi động hoặc build lại ứng dụng sau khi đổi biến môi trường vì `R2_PUBLIC_URL` cũng được dùng để tạo allowlist bảo mật cho `next/image`.

## 3. Quy tắc của API

- `GET /api/admin/media`: trả trạng thái cấu hình và giới hạn upload cho admin đã đăng nhập.
- `POST /api/admin/media`: nhận `multipart/form-data`, kiểm tra session, CSRF, role, dung lượng và chữ ký thực của tệp rồi upload.
- `DELETE /api/admin/media`: chỉ xóa object thuộc đúng public URL/prefix đã cấu hình; từ chối xóa nếu ảnh còn được sản phẩm, bài viết hoặc lịch sử đơn hàng tham chiếu.
- Hỗ trợ JPEG, PNG, WebP và AVIF, tối đa 8 MB mỗi ảnh.
- Object dùng tên UUID và cache immutable một năm. Ảnh upload nhưng bị hủy form sẽ được dọn tự động theo cơ chế best-effort.

Không commit `.env.local`, Access Key ID hoặc Secret Access Key vào Git.
