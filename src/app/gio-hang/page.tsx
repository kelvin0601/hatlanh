"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const cartItems: { id: number; name: string; weight: string; price: number; quantity: number }[] = [];

  if (cartItems.length === 0) {
    return (
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto text-center"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sand flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted" />
            </div>
            <h1
              className="text-ink leading-[1.18] font-medium mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
            >
              Giỏ hàng trống
            </h1>
            <p className="text-body text-[17px] leading-[1.65] mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm ngũ cốc Hạt Lành.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors"
            >
              Khám phá sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <h1
          className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-8"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
        >
          Giỏ hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-paper rounded-[14px] p-4 md:p-5 flex items-center gap-4">
                <div className="w-20 h-20 rounded-[10px] bg-sand flex items-center justify-center shrink-0">
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-ink font-semibold text-[16px] truncate">{item.name}</h2>
                  <p className="text-muted text-[14px]">{item.weight}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-sand transition-colors" aria-label="Giảm số lượng">
                    <Minus className="w-4 h-4 text-ink" />
                  </button>
                  <span className="w-8 text-center text-ink font-medium">{item.quantity}</span>
                  <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-sand transition-colors" aria-label="Tăng số lượng">
                    <Plus className="w-4 h-4 text-ink" />
                  </button>
                </div>
                <p className="text-ink font-bold text-[17px] w-28 text-right">
                  {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}₫
                </p>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-error/10 transition-colors" aria-label="Xóa sản phẩm">
                  <Trash2 className="w-4 h-4 text-error" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-paper rounded-2xl p-6 h-fit sticky top-[calc(var(--header-height)+24px)]">
            <h2 className="text-ink font-semibold text-[17px] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Tóm tắt đơn hàng
            </h2>
            <div className="flex flex-col gap-3 border-b border-border pb-4 mb-4">
              <div className="flex justify-between text-[15px]">
                <span className="text-body">Tạm tính</span>
                <span className="text-ink font-medium">0₫</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-body">Phí vận chuyển</span>
                <span className="text-muted">Tính khi thanh toán</span>
              </div>
            </div>
            <div className="flex justify-between text-[17px] font-bold mb-6">
              <span className="text-ink">Tổng cộng</span>
              <span className="text-ink">0₫</span>
            </div>
            <Link
              href="/thanh-toan"
              className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] rounded-full transition-colors w-full"
            >
              Thanh toán
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
