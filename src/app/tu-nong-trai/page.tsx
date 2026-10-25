import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Leaf, PackageCheck, ShieldCheck, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSitePageContent } from "@/lib/site-content-store";

export const metadata: Metadata = {
  title: "Từ nông trại đến bàn ăn | An Vị",
  description: "Khám phá hành trình chọn lọc nguyên liệu và quy trình sản xuất ngũ cốc An Vị.",
};

const container = { width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" };
const benefitIcons = [Sprout, PackageCheck, Leaf, ShieldCheck, BadgeCheck];
type GalleryImage = { url: string; alt: string };

function parseGallery(value: string): GalleryImage[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is GalleryImage => typeof item === "object" && item !== null && typeof (item as GalleryImage).url === "string" && typeof (item as GalleryImage).alt === "string") : [];
  } catch {
    return [];
  }
}

export default async function FarmPage() {
  const content = await getSitePageContent("farm");
  const benefits = benefitIcons.map((icon, index) => ({ icon, title: content[`benefit${index + 1}Title`], body: content[`benefit${index + 1}Body`] }));
  const steps = Array.from({ length: 4 }, (_, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: content[`step${index + 1}Title`],
    body: content[`step${index + 1}Body`],
    image: content[`step${index + 1}Image`],
    imageAlt: content[`step${index + 1}ImageAlt`],
  }));
  const factoryGallery = parseGallery(content.factoryGallery);
  const marqueeRows = [factoryGallery.filter((_, index) => index % 2 === 0), factoryGallery.filter((_, index) => index % 2 === 1)];

  return (
    <article className="overflow-hidden bg-[#f7f2e8]">
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={content.heroImage} alt={content.heroImageAlt} fill priority sizes="100vw" className="-z-20 object-cover object-[62%_center]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10 md:bg-gradient-to-r md:from-ink/90 md:via-ink/55 md:to-ink/5" />
        <div className="mx-auto flex min-h-[560px] items-end pb-16 pt-24 md:min-h-[600px] md:items-center md:pb-24 lg:min-h-[640px]" style={container}>
          <div className="max-w-[700px]">
            <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">{content.heroEyebrow}</p>
            <h1 className="whitespace-pre-line text-balance font-medium leading-[1.06] tracking-[-0.035em] text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)" }}>{content.heroTitle}</h1>
            <div aria-hidden="true" className="my-6 flex items-center gap-2 text-wheat"><Leaf className="h-4 w-4" strokeWidth={1.5} /><span className="h-px w-20 bg-current opacity-70" /></div>
            <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/90 lg:text-[17px]">{content.heroBody}</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-8 w-full text-[#fbf7ee] md:h-14"><path d="M0 64C240 20 480 0 720 16s480 40 720 8v56H0Z" fill="currentColor" /></svg>
      </section>

      <section className="border-y border-forest/10 bg-[#fbf7ee]">
        <div className="mx-auto grid grid-cols-2 gap-x-3 gap-y-7 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:py-5" style={container}>
          {benefits.map((item) => <div key={item.title} className="flex flex-col items-center px-2 text-center"><span className="grid h-14 w-14 place-items-center rounded-full border border-wheat/50 bg-[#fffaf0] text-forest"><item.icon className="h-6 w-6" strokeWidth={1.5} /></span><h2 className="mt-3 text-[13px] font-semibold text-ink">{item.title}</h2><p className="mt-0.5 text-[11px] leading-4 text-muted">{item.body}</p></div>)}
        </div>
      </section>

      <section id="quy-trinh" className="bg-[#fbf7ee] py-14 lg:py-20">
        <div className="mx-auto" style={container}>
          <div className="grid gap-6 border-b border-forest/10 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c2642c]">{content.processEyebrow}</p>
              <h2 className="mt-3 max-w-[620px] whitespace-pre-line font-medium leading-[1.08] tracking-[-0.025em] text-ink" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3vw, 3rem)" }}>{content.processTitle}</h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-[640px] text-[15px] leading-[1.7] text-body">{content.processBody}</p>
              <ButtonLink href="/san-pham" variant="outline-dark" withArrow className="mt-5">Tìm hiểu sản phẩm</ButtonLink>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div aria-hidden="true" className="absolute left-[8%] right-[8%] top-5 hidden border-t border-dashed border-wheat/60 lg:block" />
            {steps.map((step) => <article key={step.number} className="group relative flex h-full flex-col rounded-[18px] border border-forest/8 bg-white/65 p-3 shadow-[0_10px_30px_rgba(47,66,48,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(47,66,48,0.12)]"><span className="relative z-10 mb-3 grid h-10 w-10 place-items-center rounded-full border border-wheat/40 bg-[#fff8eb] text-[13px] font-bold text-[#a85828] shadow-sm">{step.number}</span><div className="relative aspect-[16/10] overflow-hidden rounded-[13px] bg-sand"><Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 320px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" /></div><div className="flex flex-1 flex-col px-1 pb-1 pt-4"><h3 className="whitespace-pre-line text-[16px] font-semibold leading-[1.3] text-ink">{step.title}</h3><p className="mt-2 text-[13px] leading-[1.55] text-muted">{step.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f1eadc] py-12 lg:py-20">
        <div className="mx-auto overflow-hidden rounded-[28px] bg-[#fbf7ee] shadow-[0_24px_70px_rgba(31,58,39,0.12)] lg:grid lg:min-h-[620px] lg:grid-cols-[0.58fr_1.75fr]" style={container}>
          <div className="relative z-10 flex items-center px-7 py-12 sm:px-10 lg:px-12 xl:px-14">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-14 h-64 w-64 rounded-full border border-sage/15" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-2 h-40 w-40 rounded-full bg-sage/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 inset-y-0 hidden w-28 rounded-[0_55%_55%_0/0_45%_55%_0] bg-[#fbf7ee] lg:block" />
            <div className="relative z-10 max-w-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b86b34]">{content.factoryEyebrow}</p>
              <h2 className="mt-4 text-balance font-medium leading-[1.05] tracking-[-0.025em] text-forest" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.25rem, 3vw, 3.4rem)" }}>{content.factoryTitle}</h2>
              <span className="mt-5 block h-px w-16 bg-wheat" />
              <p className="mt-5 text-[15px] leading-[1.7] text-body">{content.factoryBody}</p>
              <ButtonLink href="/lien-he" variant="primary" withArrow className="mt-7">Liên hệ tham quan</ButtonLink>
            </div>
          </div>

          {factoryGallery.length > 6 ? <div className="flex min-w-0 flex-col justify-center gap-3 overflow-hidden bg-sand/45 py-3">
            {marqueeRows.map((row, rowIndex) => <div key={rowIndex} className="overflow-hidden"><div className={`farm-gallery-marquee flex w-max ${rowIndex === 1 ? "farm-gallery-marquee-reverse" : ""}`}>{[0, 1].map((copy) => <div key={copy} aria-hidden={copy === 1} className="flex gap-3 pr-3">{row.map((item, index) => <div key={`${copy}-${item.url}-${index}`} className="relative aspect-[16/10] w-[260px] shrink-0 overflow-hidden rounded-[16px] bg-sand sm:w-[330px]"><Image src={item.url} alt={copy === 0 ? item.alt : ""} fill sizes="330px" className="object-cover" /></div>)}</div>)}</div></div>)}
          </div> : <div className="grid min-h-[620px] grid-cols-12 grid-rows-2 gap-1.5 bg-[#f1eadc] p-1.5">
            {factoryGallery.slice(0, 6).map((item, index) => {
              const layout = ["col-span-12 md:col-span-5", "col-span-6 md:col-span-3", "col-span-6 md:col-span-4", "col-span-5 md:col-span-3", "col-span-7 md:col-span-5", "col-span-12 md:col-span-4"];
              return <div key={`${item.url}-${index}`} className={`relative min-h-60 overflow-hidden rounded-[16px] bg-sand ${layout[index]}`}><Image src={item.url} alt={item.alt} fill sizes="(max-width: 767px) 50vw, 32vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" /></div>;
            })}
          </div>}
        </div>
      </section>
    </article>
  );
}
