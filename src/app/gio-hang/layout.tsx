import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Kiểm tra sản phẩm, số lượng và tổng giá trị giỏ hàng Hạt Lành trước khi thanh toán.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: LayoutProps<"/gio-hang">) {
  return children;
}
