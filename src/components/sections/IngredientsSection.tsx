import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";

const ingredients = [
  { name: "Yến mạch", desc: "Giàu chất xơ", image: "/images/02_ingredients/oats.jpg" },
  { name: "Đậu đỏ", desc: "Bổ sung đạm thực vật", image: "/images/02_ingredients/red-beans.jpg" },
  { name: "Hạt chia", desc: "Giàu omega-3", image: "/images/02_ingredients/chia.jpg" },
  { name: "Hạnh nhân", desc: "Giàu vitamin E", image: "/images/02_ingredients/almonds.jpg" },
  { name: "Hạt điều", desc: "Giàu chất béo tốt", image: "/images/02_ingredients/cashews.jpg" },
  { name: "Hạt hướng dương", desc: "Giàu vitamin B", image: "/images/02_ingredients/sunflower-seeds.jpg" },
  { name: "Óc chó", desc: "Tốt cho tim mạch", image: "/images/02_ingredients/walnuts.jpg" },
  { name: "Hạt bí", desc: "Giàu kẽm", image: "/images/02_ingredients/pumpkin-seeds.jpg" },
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
            <ButtonLink
              href="/tu-nong-trai"
              variant="outline-dark"
              withArrow
            >
              Khám phá nguyên liệu
            </ButtonLink>
          </div>

          {/* Right: 2 rows of 4 circular ingredients */}
          <div className="grid grid-cols-4 gap-x-6 gap-y-8 md:gap-x-10 md:gap-y-10">
            {ingredients.map((item) => (
              <div key={item.name} className="flex flex-col items-center text-center gap-2.5">
                <div className="relative w-16 h-16 md:w-[84px] md:h-[84px] lg:w-[96px] lg:h-[96px] rounded-full overflow-hidden bg-paper shadow-sm ring-1 ring-forest/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 767px) 64px, (max-width: 1023px) 84px, 96px"
                    className="object-cover object-top scale-[1.18] origin-top"
                  />
                </div>
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
