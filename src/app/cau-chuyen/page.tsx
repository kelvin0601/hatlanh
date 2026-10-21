import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Câu chuyện An Vị | An Vị — Ngũ cốc thiên nhiên",
  description:
    "Khởi nguồn từ tình yêu thiên nhiên và vùng quê Việt Nam, An Vị mang đến ngũ cốc thiên nhiên cho bữa sáng an lành.",
  openGraph: {
    title: "Câu chuyện An Vị",
    description: "Khởi nguồn từ tình yêu thiên nhiên và vùng quê Việt Nam.",
    type: "website",
  },
};

export default function StoryPage() {
  return (
    <article>
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-3xl mx-auto">
            <h1
              className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-6 text-center"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
            >
              Câu chuyện An Vị
            </h1>
            <p className="text-body text-[17px] leading-[1.65] text-center max-w-xl mx-auto">
              An vị mỗi ngày, dưỡng thân tâm.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="aspect-[4/5] rounded-2xl bg-sand flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <p className="text-sm text-muted">Hình ảnh khởi nguồn</p>
              </div>
            </div>
            <div>
              <h2
                className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-5"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
              >
                Khởi nguồn
              </h2>
              <p className="text-body text-[17px] leading-[1.65] mb-4">
                An Vị bắt đầu từ một ước muốn giản dị — mang đến bữa sáng tự nhiên và
                an lành cho mọi gia đình Việt Nam.
              </p>
              <p className="text-body text-[17px] leading-[1.65]">
                Chúng tôi tin rằng bữa ăn mỗi ngày, dù nhỏ bé, cũng có thể là khởi đầu
                cho một lối sống khỏe mạnh và an nhiên hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2
                className="text-ink leading-[1.18] tracking-[-0.025em] font-medium mb-5"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
              >
                Triết lý sống lành
              </h2>
              <p className="text-body text-[17px] leading-[1.65] mb-4">
                &ldquo;Sống lành&rdquo; với An Vị là sống chậm lại, biết ơn những điều nhỏ bé,
                và chăm sóc bản thân bắt đầu từ những thói quen ăn uống lành mạnh.
              </p>
              <p className="text-body text-[17px] leading-[1.65]">
                Mỗi sản phẩm An Vị không chỉ là ngũ cốc — đó là lời nhắc nhở rằng
                mỗi ngày đều xứng đáng được bắt đầu một cách trọn vẹn.
              </p>
            </div>
            <div className="aspect-[4/5] rounded-2xl bg-sand flex items-center justify-center order-1 md:order-2">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                  <span className="text-2xl">🍃</span>
                </div>
                <p className="text-sm text-muted">Hình ảnh triết lý</p>
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
            Giá trị và cam kết
          </h2>
          <p className="text-body text-[17px] leading-[1.65] max-w-xl mx-auto mb-10">
            An Vị cam kết mang đến sản phẩm chất lượng, minh bạch và an toàn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Nguyên liệu chọn lọc", desc: "Mỗi loại hạt được chọn từ nguồn cung cấp uy tín, đảm bảo chất lượng." },
              { title: "Quy trình an toàn", desc: "Sản xuất theo tiêu chuẩn vệ sinh an toàn thực phẩm nghiêm ngặt." },
              { title: "Minh bạch thông tin", desc: "Thành phần, nguồn gốc và hạn sử dụng luôn rõ ràng trên mỗi sản phẩm." },
            ].map((item) => (
              <div key={item.title} className="p-6">
                <h3 className="text-ink font-semibold text-[17px] mb-3">{item.title}</h3>
                <p className="text-body text-[16px] leading-[1.65]">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors mt-10"
          >
            Khám phá sản phẩm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
