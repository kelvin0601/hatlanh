import { Leaf, Droplets, Heart, ShieldCheck, Users } from "lucide-react";
import clsx from "clsx";
import type { SiteContent } from "@/lib/site-content";

const values = [
  { icon: Leaf, title: "Nguyên liệu tự nhiên", desc: "Từ những vùng nguyên liệu chất lượng" },
  { icon: Droplets, title: "Không chất bảo quản", desc: "Giữ trọn hương vị nguyên bản" },
  { icon: Heart, title: "Tốt cho sức khỏe", desc: "Giàu dinh dưỡng, dễ sử dụng" },
  { icon: ShieldCheck, title: "An toàn, minh bạch", desc: "Truy xuất nguồn gốc rõ ràng" },
  { icon: Users, title: "Vì cộng đồng", desc: "Đồng hành cùng người nông dân" },
];

export function ValuesSection({ content }: { content: SiteContent }) {
  return (
    <section className="overflow-hidden bg-cream sm:bg-sand/50" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="mb-9 text-center sm:hidden">
          <div className="mb-5 flex items-center justify-center gap-4 text-sage">
            <span className="h-px w-10 bg-sage/45" />
            <Leaf className="h-8 w-8 fill-forest text-forest" strokeWidth={1.4} />
            <span className="h-px w-10 bg-sage/45" />
          </div>
          <h2
            className="font-medium leading-[1.08] tracking-[-0.025em] text-ink"
            style={{ fontSize: "var(--text-section-title)" }}
          >
            {content.valuesEyebrow}
          </h2>
          <span className="mx-auto my-5 block h-0.5 w-24 -rotate-2 rounded-full bg-[#d88432]" aria-hidden="true" />
          <p className="mx-auto max-w-[300px] text-[17px] leading-[1.55] text-muted">
            {content.valuesTitle}
          </p>
        </div>

        <div className="hidden text-center sm:block">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">
            {content.valuesEyebrow}
          </p>
          <h2
            className="mb-10 font-medium leading-[1.13] tracking-[-0.025em] text-ink md:mb-14"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-section-title)" }}
          >
            {content.valuesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-8 md:gap-6 lg:grid-cols-5">
          {values.map((item, index) => (
            <div
              key={item.title}
              className={clsx(
                "flex min-h-[200px] flex-col items-center rounded-[20px] border border-wheat/20 bg-paper px-6 py-4 text-center shadow-[0_10px_28px_rgba(63,55,38,0.06)] sm:min-h-0 sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none",
                index === values.length - 1 && "col-span-2 gap-5 px-5 max-sm:min-h-[150px] max-sm:flex-row max-sm:justify-center max-sm:text-left sm:col-span-1 sm:px-0 sm:text-center",
              )}
            >
              <div className={clsx("mb-4 grid h-16 w-16 shrink-0 place-items-center rounded-full border-[1.5px] border-sage/70 bg-cream p-2 shadow-[inset_0_0_0_6px_rgba(237,228,213,0.38)] sm:mb-0 sm:h-14 sm:w-14 sm:bg-transparent sm:p-0 sm:shadow-none md:h-16 md:w-16", index === values.length - 1 && "max-sm:mb-0")}>
                <item.icon className="h-7 w-7 text-forest sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={1.55} />
              </div>
              <div className={clsx(index === values.length - 1 ? "min-w-0" : "contents sm:block")}>
                <h3 className="text-[17px] font-semibold leading-[1.25] text-ink max-sm:max-w-[92px] sm:text-[14px] md:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[170px] text-[14px] leading-[1.5] text-muted sm:mt-0 sm:max-w-[160px] sm:text-[13px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
