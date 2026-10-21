import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Hoàn tất thông tin giao hàng và phương thức thanh toán cho đơn hàng Hạt Lành.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: LayoutProps<"/thanh-toan">) {
  return children;
}
