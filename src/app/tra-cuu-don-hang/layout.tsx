import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu tình trạng đơn hàng Hạt Lành bằng mã đơn hoặc số điện thoại.",
  robots: { index: false, follow: false },
};

export default function TrackingLayout({ children }: LayoutProps<"/tra-cuu-don-hang">) {
  return children;
}
