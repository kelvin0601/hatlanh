"use client";

import Link from "next/link";
import { Play, ChevronDown, Check } from "lucide-react";

const trustItems = [
  "100% tự nhiên",
  "Không chất bảo quản",
  "Tốt cho sức khỏe",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Video + poster background — full bleed */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.png"
          preload="auto"
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Left gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(33,55,40,0.85) 0%, rgba(33,55,40,0.6) 30%, rgba(33,55,40,0.2) 55%, transparent 75%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex flex-col justify-center"
        style={{
          width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))",
          minHeight: "min(820px, 90svh)",
          paddingTop: "80px",
          paddingBottom: "40px",
        }}
      >
        {/* Text — left 40–45% */}
        <div className="max-w-[520px] flex flex-col gap-6">
          <p className="text-sage font-semibold uppercase tracking-[0.14em] text-[12px] md:text-[13px]">
            Nguyên lành hạt
          </p>

          <h1
            className="text-white leading-[1.08] tracking-[-0.035em] font-medium"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.375rem, 5.6vw, 5rem)",
            }}
          >
            Từ muôn hạt{" "}
            <br className="hidden sm:block" />
            thiên nhiên,
            <br />
            đến những{" "}
            <br className="hidden sm:block" />
            ngày an nhiên.
          </h1>

          <p className="text-white/80 text-[16px] md:text-[18px] leading-[1.7] max-w-[440px]">
            Những hạt ngũ cốc mộc mạc từ quê nhà, được chọn lựa bằng sự trân trọng,
            mang đến những bữa ăn giản dị và đủ đầy.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-[15px] h-[52px] px-7 rounded-full transition-colors border border-white/10"
            >
              Khám phá sản phẩm
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/cau-chuyen"
              className="inline-flex items-center justify-center gap-2 text-white font-medium text-[15px] h-[52px] px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
            >
              Câu chuyện Hạt Lành
            </Link>
          </div>
        </div>

        {/* Play button — center-right on desktop */}
        <button
          className="hidden md:flex absolute top-1/2 right-[30%] -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all"
          aria-label="Xem video"
        >
          <Play className="w-6 h-6 text-forest fill-forest ml-0.5" />
        </button>

        {/* Trust strip — bottom */}
        <div className="mt-auto pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-white/70 text-[13px] font-medium">{item}</span>
              </div>
            ))}
          </div>

          <button
            className="hidden md:flex items-center gap-2 text-white/60 text-[13px] font-medium hover:text-white/80 transition-colors"
            onClick={() => {
              document.getElementById("ingredients")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Cuộn xuống khám phá
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
