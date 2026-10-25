import type { Metadata } from "next";
import type { CSSProperties, ReactNode, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ChevronRight,
  HandHeart,
  Heart,
  Leaf,
  Mountain,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSitePageContent } from "@/lib/site-content-store";

const BASE_URL = "https://anvi.vn";
const DESCRIPTION =
  "An Vị sinh ra từ tình yêu với quê hương Nghệ An — nơi những cánh đồng, núi rừng và con người mộc mạc nuôi dưỡng từng hạt ngũ cốc lành cho bữa ăn mỗi ngày.";

export const metadata: Metadata = {
  title: "Câu chuyện An Vị",
  description: DESCRIPTION,
  keywords: ["câu chuyện An Vị", "ngũ cốc Nghệ An", "ngũ cốc thiên nhiên", "sống lành", "An Vị"],
  alternates: { canonical: "/cau-chuyen" },
  openGraph: {
    title: "Câu chuyện An Vị — Từ những hạt lành của quê nhà",
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/images/03_story/farmer-banner-hd.jpg", alt: "Đồi chè và núi đồi trong nắng sớm" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Câu chuyện An Vị — Từ những hạt lành của quê nhà",
    description: DESCRIPTION,
    images: ["/images/03_story/farmer-banner-hd.jpg"],
  },
};

const container: CSSProperties = { width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" };
const sectionTitle: CSSProperties = { fontFamily: "var(--font-display)", fontSize: "var(--text-section-title)" };

type IconItem = { icon: LucideIcon; title: string; desc: string };

const origins: IconItem[] = [
  { icon: Mountain, title: "Thiên nhiên ưu đãi", desc: "Đất lành, khí hậu trong lành, mùa màng phong phú" },
  { icon: HandHeart, title: "Con người mộc mạc", desc: "Gìn giữ giá trị truyền thống, làm ra những điều tử tế" },
  { icon: Sprout, title: "Sản vật chất lượng", desc: "Những loại hạt tự nhiên giàu dinh dưỡng" },
];

const values: IconItem[] = [
  { icon: Leaf, title: "Tự nhiên", desc: "Ưu tiên nguyên liệu thuần khiết" },
  { icon: Heart, title: "Tử tế", desc: "Làm việc bằng sự chân thành" },
  { icon: Sprout, title: "Bền vững", desc: "Hài hòa với thiên nhiên" },
  { icon: Users, title: "Vì cộng đồng", desc: "Đồng hành cùng người nông dân" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Câu chuyện An Vị",
  description: DESCRIPTION,
  url: `${BASE_URL}/cau-chuyen`,
  about: { "@type": "Organization", name: "An Vị", url: BASE_URL },
};

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx("mb-4 text-[14px] font-semibold uppercase tracking-[0.14em] lg:text-[13px]", className)}>
      {children}
    </p>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("flex items-center gap-2 text-wheat", className)}>
      <Leaf className="h-4 w-4" strokeWidth={1.5} />
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  );
}

function LeafSprig(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 160" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M60 156C58 112 62 72 60 10" strokeLinecap="round" />
      <path d="M60 122C40 117 28 102 26 86c18 2 30 14 34 36Z" />
      <path d="M61 97c19-5 31-19 33-35-18 2-30 14-33 35Z" />
      <path d="M60 72C42 66 34 52 34 38c16 4 24 16 26 34Z" />
      <path d="M60 42c12-6 18-18 18-30-12 4-18 16-18 30Z" />
    </svg>
  );
}

export default async function StoryPage() {
  const content = await getSitePageContent("story");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="story-hero-title">
        <Image
          src={content.heroImage}
          alt={content.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[65%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/15 md:bg-gradient-to-r md:from-ink/85 md:via-ink/45 md:to-ink/5"
        />
        <div
          className="mx-auto flex min-h-[560px] items-end pb-16 pt-24 md:min-h-[600px] md:items-center md:pb-24 lg:min-h-[640px]"
          style={container}
        >
          <div className="max-w-[580px]">
            <Eyebrow className="text-white/80">{content.heroEyebrow}</Eyebrow>
            <h1
              id="story-hero-title"
              className="text-balance font-medium leading-[1.1] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 4.4vw, 3.75rem)" }}
            >
              <span className="whitespace-pre-line">{content.heroTitle}</span>
            </h1>
            <Ornament className="my-6" />
            <p className="max-w-[460px] text-[17px] leading-[1.7] text-white/90">
              {content.heroBody}
            </p>
          </div>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute inset-x-0 -bottom-px h-8 w-full text-cream md:h-14"
        >
          <path d="M0 64C240 20 480 0 720 16s480 40 720 8v56H0Z" fill="currentColor" />
        </svg>
      </section>

      {/* Origin */}
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }} aria-labelledby="story-origin-title">
        <div className="mx-auto grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-20" style={container}>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-sand sm:aspect-[5/4] lg:aspect-square">
              <Image
                src={content.originImage}
                alt={content.originImageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[60%_35%]"
              />
            </div>
            <LeafSprig className="absolute -bottom-8 -left-6 hidden w-24 text-sage/70 md:block" />
          </div>

          <div>
            <Eyebrow className="text-wheat">{content.originEyebrow}</Eyebrow>
            <h2 id="story-origin-title" className="text-balance font-medium leading-[1.13] tracking-[-0.025em] text-ink" style={sectionTitle}>
              {content.originTitle}
            </h2>
            <p className="mt-5 max-w-[42rem] text-[17px] leading-[1.7] text-body">
              {content.originBody}
            </p>
            <Ornament className="my-8" />
            <ul className="grid gap-6 sm:grid-cols-3 sm:gap-5">
              {origins.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sand text-forest" aria-hidden="true">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="[font-family:var(--font-body)] text-[16px] font-semibold leading-[1.35] text-ink">{title}</h3>
                    <p className="mt-1 text-[14px] leading-[1.5] text-muted">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }} aria-labelledby="story-journey-title">
        <div className="mx-auto grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20" style={container}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-sand sm:aspect-[5/4] lg:order-last lg:aspect-square">
            <Image
              src={content.journeyImage}
              alt={content.journeyImageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[76%_center]"
            />
          </div>

          <div>
            <Eyebrow className="text-wheat">{content.journeyEyebrow}</Eyebrow>
            <h2 id="story-journey-title" className="text-balance font-medium leading-[1.13] tracking-[-0.025em] text-ink" style={sectionTitle}>
              {content.journeyTitle}
            </h2>
            <p className="mt-5 max-w-[42rem] text-[17px] leading-[1.7] text-ink">
              {content.journeyBody}
            </p>
            <Link
              href="/san-pham"
              className="link-underline mt-8 inline-flex items-center gap-1.5 text-[16px] font-semibold text-forest"
            >
              Xem các dòng ngũ cốc An Vị
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="story-values-title">
        <Image
          src={content.valuesImage}
          alt={content.valuesImageAlt}
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[center_35%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-ink/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink/90 lg:via-ink/70 lg:to-ink/45"
        />
        <div
          className="mx-auto grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16"
          style={{ ...container, paddingBlock: "var(--section-space)" }}
        >
          <div>
            <Eyebrow className="text-wheat">{content.valuesEyebrow}</Eyebrow>
            <h2 id="story-values-title" className="text-balance font-medium leading-[1.13] tracking-[-0.025em] text-white" style={sectionTitle}>
              {content.valuesTitle}
            </h2>
            <Ornament className="my-6" />
            <p className="max-w-[460px] text-[17px] leading-[1.7] text-white/85">
              {content.valuesBody}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex flex-col items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/30" aria-hidden="true">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="[font-family:var(--font-body)] mt-4 text-[16px] font-semibold leading-[1.35] text-white">{title}</h3>
                <p className="mt-1 text-[14px] leading-[1.5] text-white/75">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }} aria-labelledby="story-vision-title">
        <div className="mx-auto grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20" style={container}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand lg:aspect-[5/4]">
            <Image
              src={content.visionImage}
              alt={content.visionImageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[70%_center]"
            />
          </div>

          <div>
            <Eyebrow className="text-wheat">{content.visionEyebrow}</Eyebrow>
            <h2 id="story-vision-title" className="text-balance font-medium leading-[1.13] tracking-[-0.025em] text-ink" style={sectionTitle}>
              {content.visionTitle}
            </h2>
            <p className="mt-5 max-w-[42rem] text-[17px] leading-[1.7] text-body">
              {content.visionBody}
            </p>
            <Ornament className="mt-8" />
            <Link
              href="/goc-song-lanh"
              className="link-underline mt-6 inline-flex items-center gap-1.5 text-[16px] font-semibold text-forest"
            >
              Khám phá Góc sống lành
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-ink text-center text-white" aria-labelledby="story-cta-title">
        <Image
          src={content.ctaImage}
          alt={content.ctaImageAlt}
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[center_45%]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/65 to-ink/85" />
        <div className="mx-auto max-w-2xl" style={{ ...container, paddingBlock: "var(--section-space)" }}>
          <h2 id="story-cta-title" className="text-balance font-medium leading-[1.13] tracking-[-0.025em] text-white" style={sectionTitle}>
            {content.ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.7] text-white/85">
            {content.ctaBody}
          </p>
          <ButtonLink href="/san-pham" variant="light" size="lg" withArrow className="mt-8">
            Khám phá sản phẩm
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
