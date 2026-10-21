import type { Metadata } from "next";
import { OrderSuccessContent } from "@/components/commerce/OrderSuccessContent";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  description: "An Vị đã tiếp nhận đơn hàng của bạn.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}
