import { Quote } from "lucide-react";
import { DotCarousel } from "@/components/ui/DotCarousel";
import type { SiteContent } from "@/lib/site-content";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "Ngũ cốc thơm, dễ ăn và rất tự nhiên. Tôi cảm thấy khỏe hơn và có nhiều năng lượng hơn mỗi ngày.",
    name: "Nguyễn Thị Mai",
    location: "Hà Nội",
  },
  {
    quote: "Sản phẩm chất lượng, giao hàng nhanh. Tôi đặc biệt thích câu chuyện và cách An Vị làm việc.",
    name: "Trần Văn Minh",
    location: "TP. Hồ Chí Minh",
  },
  {
    quote: "Bữa sáng tiện lợi mà vẫn đầy đủ dinh dưỡng. Cảm giác rất an tâm khi sử dụng.",
    name: "Lê Thu Hà",
    location: "Đà Nẵng",
  },
];

export function TestimonialsSection({ content }: { content: SiteContent }) {
  return (
    <section className="overflow-hidden bg-paper" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-3">
          {content.testimonialsEyebrow}
        </p>
        <h2
          className="text-ink leading-[1.13] tracking-[-0.025em] font-medium mb-10 md:mb-12 max-sm:max-w-[280px]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-section-title)",
          }}
        >
          {content.testimonialsTitle}
        </h2>

        <div className="md:hidden">
          <DotCarousel label="Nhận xét của khách hàng">
            {testimonials.map((item, index) => (
              <div
                key={item.name}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${testimonials.length}`}
                className="min-w-0 shrink-0 grow-0 basis-[88%] pl-5"
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </DotCarousel>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="bg-cream rounded-[14px] p-6 md:p-7 flex flex-col h-full">
      <Quote className="w-8 h-8 text-sage/40 mb-4" strokeWidth={1.5} aria-hidden="true" />
      <blockquote className="text-body text-[16px] leading-[1.7] flex-1 mb-6">
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3 pt-4 border-t border-border/40">
        <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center" aria-hidden="true">
          <span className="text-ink text-[14px] font-semibold">
            {item.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-ink font-semibold text-[14px]">{item.name}</p>
          <p className="text-muted text-[13px]">{item.location}</p>
        </div>
      </figcaption>
    </figure>
  );
}
