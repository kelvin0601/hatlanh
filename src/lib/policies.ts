export interface Policy {
  slug: string;
  title: string;
  content: string;
}

export const policies: Policy[] = [
  {
    slug: "huong-dan-mua-hang",
    title: "Hướng dẫn mua hàng",
    content: `## Cách đặt hàng trên website

1. Chọn sản phẩm bạn muốn mua và nhấn **Thêm vào giỏ**
2. Vào **Giỏ hàng** để kiểm tra đơn hàng
3. Nhấn **Thanh toán** và điền thông tin giao hàng
4. Chọn phương thức thanh toán và xác nhận đơn hàng
5. Bạn sẽ nhận email xác nhận đơn hàng

## Phương thức thanh toán

- **Chuyển khoản ngân hàng**
- **Thanh toán khi nhận hàng (COD)**
- **VNPay / MoMo** (sắp ra mắt)

## Hỗ trợ

Nếu gặp khó khăn khi đặt hàng, vui lòng liên hệ hotline hoặc gửi tin nhắn qua trang Liên hệ.`,
  },
  {
    slug: "giao-hang",
    title: "Chính sách giao hàng",
    content: `## Phạm vi giao hàng

An Vị giao hàng toàn quốc thông qua các đối tác vận chuyển uy tín.

## Thời gian giao hàng

- **Nội thành TP.HCM và Hà Nội:** 1–2 ngày làm việc
- **Các tỉnh thành khác:** 3–5 ngày làm việc

## Phí vận chuyển

- Miễn phí giao hàng cho đơn từ **300.000₫**
- Đơn dưới 300.000₫: phí ship từ 20.000₫ tùy khu vực

## Theo dõi đơn hàng

Sau khi đơn hàng được gửi đi, bạn sẽ nhận mã vận đơn qua email hoặc SMS để theo dõi.`,
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    content: `## Điều kiện đổi trả

An Vị chấp nhận đổi trả trong **7 ngày** kể từ ngày nhận hàng nếu:

- Sản phẩm bị lỗi do nhà sản xuất
- Sản phẩm giao sai so với đơn hàng
- Sản phẩm hư hỏng trong quá trình vận chuyển

## Quy trình đổi trả

1. Liên hệ An Vị qua hotline hoặc email
2. Cung cấp mã đơn hàng và ảnh chụp sản phẩm
3. An Vị xác nhận và hướng dẫn gửi trả
4. Hoàn tiền hoặc gửi sản phẩm thay thế trong 3–5 ngày

## Lưu ý

Sản phẩm đổi trả cần còn nguyên bao bì. Không áp dụng đổi trả cho sản phẩm đã mở sử dụng (trừ trường hợp lỗi).`,
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật",
    content: `## Thu thập thông tin

An Vị thu thập thông tin cần thiết để xử lý đơn hàng: họ tên, số điện thoại, địa chỉ giao hàng và email.

## Sử dụng thông tin

Thông tin của bạn chỉ được sử dụng để:
- Xử lý và giao đơn hàng
- Liên hệ khi cần xác nhận đơn hàng
- Gửi thông tin ưu đãi (nếu bạn đăng ký nhận tin)

## Bảo vệ thông tin

Chúng tôi cam kết không chia sẻ thông tin cá nhân cho bên thứ ba ngoài mục đích giao hàng.

## Quyền của bạn

Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào bằng cách liên hệ với chúng tôi.`,
  },
  {
    slug: "dieu-khoan-su-dung",
    title: "Điều khoản sử dụng",
    content: `## Điều khoản chung

Khi sử dụng website An Vị, bạn đồng ý tuân thủ các điều khoản dưới đây.

## Sản phẩm và giá cả

- Giá sản phẩm có thể thay đổi mà không cần báo trước
- An Vị nỗ lực cung cấp thông tin chính xác nhất có thể
- Hình ảnh sản phẩm mang tính minh họa

## Đặt hàng

- Đơn hàng chỉ được xác nhận sau khi An Vị gửi email/SMS xác nhận
- An Vị có quyền từ chối đơn hàng nếu phát hiện thông tin không chính xác

## Sở hữu trí tuệ

Toàn bộ nội dung, hình ảnh và thiết kế trên website thuộc quyền sở hữu của An Vị.`,
  },
];

export function getPolicyBySlug(slug: string): Policy | undefined {
  return policies.find((p) => p.slug === slug);
}
