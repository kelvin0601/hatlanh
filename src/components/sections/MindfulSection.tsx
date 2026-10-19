import Link from "next/link";

export function MindfulSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Full-width breakfast lifestyle background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            background: "linear-gradient(120deg, #b5a68a 0%, #d4c4a8 30%, #EDE4D5 60%, #F8F4EA 100%)",
          }}
        />
        {/* Left dark overlay for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(33,55,40,0.75) 0%, rgba(33,55,40,0.45) 35%, rgba(33,55,40,0.1) 55%, transparent 70%)",
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
          <p className="text-white/50 text-[12px] font-semibold uppercase tracking-[0.2em] mb-4">
            A moment of calm
          </p>
          <h2
            className="text-white leading-[1.08] tracking-[-0.025em] font-medium mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
            }}
          >
            Một chút an yên
            <br />
            cho mỗi ngày
          </h2>
          <p className="text-white/75 text-[16px] md:text-[17px] leading-[1.7] mb-8 max-w-[420px]">
            Giữa những bận bề thường nhật, hãy dành một chút thời gian cho bản thân.
            Một bữa ăn giản dị, một tách trà ấm và những hạt ngũ cốc lành
            — để nuôi dưỡng cả thân và tâm.
          </p>
          <Link
            href="/goc-song-lanh"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold text-[15px] h-[48px] px-6 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
          >
            Khám phá công thức
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
