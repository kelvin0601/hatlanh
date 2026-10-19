import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Từ nông trại — Nguồn gốc nguyên liệu | Hạt Lành",
  description:
    "Tìm hiểu về nguồn gốc nguyên liệu, vùng trồng và hành trình từ nông trại đến bàn ăn của ngũ cốc Hạt Lành.",
  openGraph: {
    title: "Từ nông trại — Nguồn gốc nguyên liệu | Hạt Lành",
    description: "Hành trình từ nông trại đến bàn ăn của ngũ cốc Hạt Lành.",
    type: "website",
  },
};

const ingredients = [
  { name: "Yến mạch", origin: "Nguyên hạt, giàu chất xơ beta-glucan", emoji: "🌾" },
  { name: "Gạo lứt", origin: "Nguyên cám, giữ lại lớp cám giàu dinh dưỡng", emoji: "🍚" },
  { name: "Đậu đỏ", origin: "Nguồn protein thực vật, giàu sắt và kali", emoji: "🫘" },
  { name: "Hạt sen", origin: "Hạt sen khô, an thần tự nhiên", emoji: "🪷" },
  { name: "Hạt chia", origin: "Giàu omega-3 và chất xơ", emoji: "🌱" },
  { name: "Hạnh nhân", origin: "Giàu vitamin E và chất chống oxy hóa", emoji: "🥜" },
  { name: "Quinoa", origin: "Siêu hạt, chứa đầy đủ amino acid thiết yếu", emoji: "🌿" },
  { name: "Hạt bí", origin: "Giàu kẽm và magiê", emoji: "🎃" },
];

export default function FarmPage() {
  return (
    <article>
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
            >
              Từ nông trại đến bàn ăn
            </h1>
            <p className="text-body text-[17px] leading-[1.65] max-w-xl mx-auto">
              Mỗi hạt ngũ cốc trong sản phẩm Hạt Lành đều được chọn lọc kỹ lưỡng,
              đảm bảo chất lượng từ nguồn nguyên liệu đến tay bạn.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <h2
            className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-10 text-center"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
          >
            Các loại hạt trong ngũ cốc Hạt Lành
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ingredients.map((item) => (
              <div
                key={item.name}
                className="bg-cream rounded-[14px] p-6 text-center hover:shadow-[var(--shadow-soft)] transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sand flex items-center justify-center text-3xl">
                  {item.emoji}
                </div>
                <h3 className="text-ink font-semibold text-[17px] mb-2">{item.name}</h3>
                <p className="text-muted text-[15px] leading-[1.5]">{item.origin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="aspect-[4/3] rounded-2xl bg-sand flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                  <span className="text-2xl">🏭</span>
                </div>
                <p className="text-sm text-muted">Hình ảnh quy trình sản xuất</p>
              </div>
            </div>
            <div>
              <h2
                className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-5"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
              >
                Hành trình sản xuất
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { step: "01", title: "Chọn lọc nguyên liệu", desc: "Mỗi loại hạt được kiểm tra chất lượng trước khi đưa vào sản xuất." },
                  { step: "02", title: "Phối trộn công thức", desc: "Các loại hạt được phối trộn theo tỷ lệ cân bằng dinh dưỡng." },
                  { step: "03", title: "Đóng gói an toàn", desc: "Đóng gói trong môi trường sạch, bảo quản hương vị và chất lượng." },
                  { step: "04", title: "Đến tay bạn", desc: "Sản phẩm được giao đến bạn trong tình trạng tốt nhất." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-sage font-bold text-[14px] mt-1">{item.step}</span>
                    <div>
                      <h3 className="text-ink font-semibold text-[16px] mb-1">{item.title}</h3>
                      <p className="text-body text-[15px] leading-[1.65]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto text-center"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <h2
            className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-5"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
          >
            Trải nghiệm ngũ cốc Hạt Lành
          </h2>
          <p className="text-body text-[17px] leading-[1.65] max-w-xl mx-auto mb-8">
            Khám phá các sản phẩm ngũ cốc thiên nhiên, được chế biến tận tâm từ những hạt ngũ cốc tốt nhất.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors"
          >
            Xem sản phẩm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
