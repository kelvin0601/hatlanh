import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Ngũ cốc thơm, dễ ăn và rất tự nhiên. Tôi cảm thấy khỏe hơn và có nhiều năng lượng hơn mỗi ngày.",
    name: "Nguyễn Thị Mai",
    location: "Hà Nội",
  },
  {
    quote: "Sản phẩm chất lượng, giao hàng nhanh. Tôi đặc biệt thích câu chuyện và cách Hạt Lành làm việc.",
    name: "Trần Văn Minh",
    location: "TP. Hồ Chí Minh",
  },
  {
    quote: "Bữa sáng tiện lợi mà vẫn đầy đủ dinh dưỡng. Cảm giác rất an tâm khi sử dụng.",
    name: "Lê Thu Hà",
    location: "Đà Nẵng",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-3">
          Khách hàng nói về Hạt Lành
        </p>
        <h2
          className="text-ink leading-[1.13] tracking-[-0.025em] font-medium mb-10 md:mb-12"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
          }}
        >
          Những chia sẻ chân thật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-cream rounded-[14px] p-6 md:p-7 flex flex-col"
            >
              <Quote className="w-8 h-8 text-sage/40 mb-4" strokeWidth={1.5} />
              <p className="text-body text-[16px] leading-[1.7] flex-1 mb-6">
                {item.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center">
                  <span className="text-ink text-[14px] font-semibold">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-ink font-semibold text-[14px]">{item.name}</p>
                  <p className="text-muted text-[13px]">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
