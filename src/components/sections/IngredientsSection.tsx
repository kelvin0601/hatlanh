import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wheat } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getProductIngredients } from "@/lib/admin-store";
import type { SiteContent } from "@/lib/site-content";

export async function IngredientsSection({ content }: { content: SiteContent }) {
  const ingredients = await getProductIngredients();
  return (
    <section id="ingredients" className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-wheat/15 bg-paper p-4 shadow-[0_16px_45px_rgba(46,57,38,0.08)] md:hidden">
          <Wheat className="pointer-events-none absolute -right-5 top-4 h-28 w-28 rotate-[-18deg] text-sage/15" strokeWidth={1.1} aria-hidden="true" />

          <div className="relative px-1 pb-6 pt-3">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#bd681f]">
              {content.ingredientsEyebrow}
            </p>
            <h2 className="max-w-[290px] whitespace-pre-line text-[clamp(2rem,9.5vw,2.65rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
              {content.ingredientsTitle}
            </h2>
            <p className="mt-4 max-w-[310px] text-[15px] leading-[1.65] text-body">
              {content.ingredientsBody}
            </p>
          </div>

          <div className="relative space-y-3">
            {ingredients.map((item) => (
              <Link
                key={item.name}
                href={{ pathname: "/san-pham", query: { ingredient: item.name } }}
                aria-label={`Xem sản phẩm có nguyên liệu ${item.name}`}
                className="group grid min-h-[112px] grid-cols-[42%_1fr] overflow-hidden rounded-[18px] bg-cream shadow-[0_8px_24px_rgba(46,57,38,0.06)] ring-1 ring-border/35"
              >
                <div className="relative min-h-[112px] overflow-hidden bg-sand">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="42vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-sage" aria-hidden="true">
                      <Wheat className="h-10 w-10" strokeWidth={1.4} />
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[20px] font-semibold leading-tight text-ink">{item.name}</h3>
                    <p className="mt-1 text-[13px] leading-[1.45] text-muted">Nguyên liệu tự nhiên chọn lọc</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-wheat/40 bg-paper text-[#a86224] transition-transform group-active:translate-x-1" aria-hidden="true">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/san-pham" className="mt-4 flex min-h-13 items-center justify-center gap-3 rounded-full bg-forest px-5 text-[15px] font-semibold text-white">
            Xem tất cả sản phẩm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="hidden items-center gap-10 md:grid md:grid-cols-1 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          {/* Left: Text */}
          <div>
            <p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-4">
              {content.ingredientsEyebrow}
            </p>
            <h2
              className="text-ink leading-[1.08] tracking-[-0.025em] font-medium mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-section-title)",
              }}
            >
              <span className="whitespace-pre-line">{content.ingredientsTitle}</span>
            </h2>
            <p className="text-body text-[17px] leading-[1.7] max-w-[400px] mb-8">
              {content.ingredientsBody}
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
              <Link
                key={item.name}
                href={{ pathname: "/san-pham", query: { ingredient: item.name } }}
                aria-label={`Xem sản phẩm có nguyên liệu ${item.name}`}
                className="group flex flex-col items-center gap-2.5 text-center outline-none"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-paper shadow-sm ring-1 ring-forest/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-forest md:h-[84px] md:w-[84px] lg:h-[96px] lg:w-[96px]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="(max-width: 767px) 64px, (max-width: 1023px) 84px, 96px"
                      className="origin-top scale-[1.18] object-cover object-top transition-transform duration-300 group-hover:scale-[1.24]"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-sand text-sage" aria-hidden="true">
                      <Wheat className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.5} />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold leading-tight text-ink transition-colors group-hover:text-forest md:text-[15px]">
                    {item.name}
                  </p>
                  <p className="text-muted text-[12px] md:text-[13px] leading-snug mt-0.5">
                    Nguyên liệu tự nhiên
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
