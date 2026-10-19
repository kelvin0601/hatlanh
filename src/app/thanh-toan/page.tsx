"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    note: "",
    payment: "cod",
  });

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <Link
          href="/gio-hang"
          className="inline-flex items-center gap-2 text-forest font-medium text-sm mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại giỏ hàng
        </Link>

        <h1
          className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-8"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
        >
          Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form className="lg:col-span-2 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="bg-paper rounded-2xl p-6 md:p-8">
              <h2
                className="text-ink font-semibold text-[18px] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Thông tin giao hàng
              </h2>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-ink font-medium text-[15px]">Họ và tên *</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-ink font-medium text-[15px]">Số điện thoại *</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="checkout-email" className="text-ink font-medium text-[15px]">Email</label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="address" className="text-ink font-medium text-[15px]">Địa chỉ giao hàng *</label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="text-ink font-medium text-[15px]">Tỉnh / Thành phố *</label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="note" className="text-ink font-medium text-[15px]">Ghi chú</label>
                  <textarea
                    id="note"
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="px-4 py-3 rounded-[12px] border border-border bg-cream text-body text-base leading-[1.65] resize-none focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                  />
                </div>
              </div>
            </div>

            <div className="bg-paper rounded-2xl p-6 md:p-8">
              <h2
                className="text-ink font-semibold text-[18px] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Phương thức thanh toán
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                  { value: "bank", label: "Chuyển khoản ngân hàng" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-[12px] border cursor-pointer transition-colors ${
                      form.payment === opt.value
                        ? "border-forest bg-forest/5"
                        : "border-border hover:border-sage"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.payment === opt.value}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                      className="w-5 h-5 accent-forest"
                    />
                    <span className="text-ink font-medium text-[15px]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] rounded-full transition-colors w-full lg:hidden"
            >
              Đặt hàng
            </button>
          </form>

          <div className="bg-paper rounded-2xl p-6 h-fit sticky top-[calc(var(--header-height)+24px)]">
            <h2 className="text-ink font-semibold text-[17px] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Đơn hàng của bạn
            </h2>
            <p className="text-muted text-[15px] mb-6">Chưa có sản phẩm trong giỏ hàng.</p>

            <div className="flex flex-col gap-3 border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-[15px]">
                <span className="text-body">Tạm tính</span>
                <span className="text-ink font-medium">0₫</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-body">Phí vận chuyển</span>
                <span className="text-muted">Miễn phí</span>
              </div>
            </div>
            <div className="flex justify-between text-[17px] font-bold mb-6 border-t border-border pt-4">
              <span className="text-ink">Tổng cộng</span>
              <span className="text-ink">0₫</span>
            </div>
            <button className="hidden lg:flex items-center justify-center bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] rounded-full transition-colors w-full">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
