"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderCode, setOrderCode] = useState("");

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h1
            className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
          >
            Tra cứu đơn hàng
          </h1>
          <p className="text-body text-[17px] leading-[1.65] mb-8">
            Nhập mã đơn hàng hoặc số điện thoại để kiểm tra tình trạng giao hàng.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              required
              placeholder="Mã đơn hàng hoặc số điện thoại"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="flex-1 h-[52px] px-5 rounded-full border border-border bg-paper text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors"
            >
              <Search className="w-4 h-4" />
              Tra cứu
            </button>
          </form>

          <div className="mt-12 bg-paper rounded-2xl p-8 text-left">
            <p className="text-muted text-[15px] text-center">
              Nhập mã đơn hàng để xem thông tin chi tiết.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
