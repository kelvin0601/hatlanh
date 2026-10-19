import Link from "next/link";
import { Play } from "lucide-react";

export function StorySection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "480px" }}>
      {/* Full-width countryside background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            background: "linear-gradient(135deg, #25452F 0%, #3a6040 25%, #798B6C 50%, #C69A62 75%, #a07840 100%)",
          }}
        />
        {/* Dark gradient left for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(33,55,40,0.88) 0%, rgba(33,55,40,0.65) 35%, rgba(33,55,40,0.2) 60%, transparent 80%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex items-center"
        style={{
          width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))",
          paddingBlock: "var(--section-space)",
        }}
      >
        <div className="max-w-[480px]">
          <p className="text-sage/80 text-[12px] font-semibold uppercase tracking-[0.14em] mb-4">
            Câu chuyện Hạt Lành
          </p>
          <h2
            className="text-white leading-[1.08] tracking-[-0.025em] font-medium mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4vw, 3.5rem)",
            }}
          >
            Từ những
            <br />
            miền quê
            <br />
            bình dị
          </h2>
          <p className="text-white/75 text-[16px] md:text-[17px] leading-[1.7] mb-8 max-w-[400px]">
            Chúng tôi tin rằng mỗi hạt ngũ cốc đều mang trong mình tinh túy của đất trời,
            sự chăm chút của người nông dân và giá trị của một lối sống lành mạnh, gần gũi.
          </p>
          <Link
            href="/cau-chuyen"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold text-[15px] h-[48px] px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
          >
            Xem câu chuyện
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Decorative script text — right side (desktop only) */}
        <div
          className="hidden lg:block absolute right-[8%] top-1/2 -translate-y-1/2 text-white/20 text-[2.5rem] leading-[1.4] italic max-w-[300px]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden="true"
        >
          Những điều lành bắt đầu từ những người từ tế.
        </div>

        {/* Play button */}
        <button
          className="hidden md:flex absolute top-1/2 right-[35%] lg:right-[45%] -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all"
          aria-label="Phát video câu chuyện"
        >
          <Play className="w-6 h-6 text-forest fill-forest ml-0.5" />
        </button>
      </div>
    </section>
  );
}
