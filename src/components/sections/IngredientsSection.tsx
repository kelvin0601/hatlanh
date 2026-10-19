import Link from "next/link";

const ingredients = [
  { name: "Yến mạch", desc: "Giàu chất xơ", color: "#e8c98a" },
  { name: "Đậu đỏ", desc: "Bổ sung đạm thực vật", color: "#c47a6a" },
  { name: "Hạt chia", desc: "Giàu omega-3", color: "#8a9a7a" },
  { name: "Hạnh nhân", desc: "Giàu vitamin E", color: "#dcc49a" },
  { name: "Đậu xanh", desc: "Thanh mát, dễ tiêu", color: "#8ab480" },
  { name: "Gạo lứt", desc: "Giàu khoáng chất", color: "#c8aa80" },
  { name: "Mè đen", desc: "Tốt cho tim mạch", color: "#5a6a50" },
  { name: "Hạt bí", desc: "Giàu kẽm", color: "#a0a860" },
];

export function IngredientsSection() {
  return (
    <section id="ingredients" className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-4">
              Nguyên liệu
            </p>
            <h2
              className="text-ink leading-[1.08] tracking-[-0.025em] font-medium mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              }}
            >
              Những hạt lành
              <br />
              từ đất trời
            </h2>
            <p className="text-body text-[17px] leading-[1.7] max-w-[400px] mb-8">
              Mỗi loại hạt mang một hương vị, một vùng đất và một câu chuyện riêng.
              Khi kết hợp lại, chúng tạo nên nguồn dinh dưỡng tự nhiên, hài hòa
              và tốt lành cho cơ thể.
            </p>
            <Link
              href="/tu-nong-trai"
              className="inline-flex items-center justify-center gap-2 text-forest font-semibold text-[15px] h-[48px] px-6 rounded-full border border-forest/30 hover:bg-forest/5 transition-colors"
            >
              Khám phá nguyên liệu
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Right: 2 rows of 4 circular ingredients */}
          <div className="grid grid-cols-4 gap-x-6 gap-y-8 md:gap-x-10 md:gap-y-10">
            {ingredients.map((item) => (
              <div key={item.name} className="flex flex-col items-center text-center gap-2.5">
                <div
                  className="w-16 h-16 md:w-[84px] md:h-[84px] lg:w-[96px] lg:h-[96px] rounded-full shadow-sm"
                  style={{
                    background: `radial-gradient(circle at 40% 35%, ${item.color}dd 0%, ${item.color} 60%, ${item.color}99 100%)`,
                  }}
                />
                <div>
                  <p className="text-ink font-semibold text-[14px] md:text-[15px] leading-tight">
                    {item.name}
                  </p>
                  <p className="text-muted text-[12px] md:text-[13px] leading-snug mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
