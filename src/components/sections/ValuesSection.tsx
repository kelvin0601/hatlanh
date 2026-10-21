import { Leaf, Droplets, Heart, ShieldCheck, Users } from "lucide-react";

const values = [
  { icon: Leaf, title: "Nguyên liệu tự nhiên", desc: "Từ những vùng nguyên liệu chất lượng" },
  { icon: Droplets, title: "Không chất bảo quản", desc: "Giữ trọn hương vị nguyên bản" },
  { icon: Heart, title: "Tốt cho sức khỏe", desc: "Giàu dinh dưỡng, dễ sử dụng" },
  { icon: ShieldCheck, title: "An toàn, minh bạch", desc: "Truy xuất nguồn gốc rõ ràng" },
  { icon: Users, title: "Vì cộng đồng", desc: "Đồng hành cùng người nông dân" },
];

export function ValuesSection() {
  return (
    <section className="bg-sand/50" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] text-center mb-3">
          Vì sao chọn An Vị
        </p>
        <h2
          className="text-ink leading-[1.13] tracking-[-0.025em] font-medium text-center mb-10 md:mb-14"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
          }}
        >
          Lành từ gốc, tốt cho bạn
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
          {values.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[1.5px] border-forest/30 flex items-center justify-center">
                <item.icon className="w-6 h-6 md:w-7 md:h-7 text-forest" strokeWidth={1.4} />
              </div>
              <h3 className="text-ink font-semibold text-[14px] md:text-[15px] leading-tight">
                {item.title}
              </h3>
              <p className="text-muted text-[13px] leading-[1.5] max-w-[160px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
