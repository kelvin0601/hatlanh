import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Đặt hàng thành công | Hạt Lành",
  description: "Cảm ơn bạn đã đặt hàng tại Hạt Lành. Đơn hàng của bạn đang được xử lý.",
};

export default function OrderSuccessPage() {
  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto text-center"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-forest/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-forest" />
          </div>

          <h1
            className="text-ink leading-[1.18] font-medium mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
          >
            Đặt hàng thành công!
          </h1>

          <p className="text-body text-[17px] leading-[1.65] mb-3">
            Cảm ơn bạn đã tin tưởng Hạt Lành. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
          </p>
          <p className="text-muted text-[15px] leading-[1.65] mb-8">
            Bạn sẽ nhận thông tin cập nhật qua email hoặc SMS.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tra-cuu-don-hang"
              className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors"
            >
              Tra cứu đơn hàng
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-forest font-medium text-base h-[52px] px-5 rounded-full border border-forest/20 hover:bg-forest/5 transition-colors"
            >
              Về trang chủ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
