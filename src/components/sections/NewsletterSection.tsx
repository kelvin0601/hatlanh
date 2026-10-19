"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-sand" style={{ paddingBlock: "clamp(48px, 6vw, 80px)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
          {/* Left: text */}
          <div className="flex-1 max-w-lg">
            <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-2">
              Đăng ký nhận tin
            </p>
            <h2
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              Cùng Hạt Lành sống lành mỗi ngày
            </h2>
            <p className="text-body text-[15px] leading-[1.6]">
              Nhận thông tin về sản phẩm mới, công thức hay và những câu chuyện từ tế.
            </p>
          </div>

          {/* Right: form */}
          <form
            className="flex gap-3 w-full md:w-auto md:min-w-[400px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[52px] px-5 rounded-full bg-paper border border-border text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-[15px] h-[52px] px-7 rounded-full transition-colors whitespace-nowrap"
            >
              Đăng ký
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
