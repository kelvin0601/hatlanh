import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Góc sống lành — Blog dinh dưỡng và lối sống | Hạt Lành",
  description:
    "Kiến thức về ngũ cốc, công thức món ăn lành mạnh và bí quyết sống khỏe mỗi ngày từ Hạt Lành.",
  openGraph: {
    title: "Góc sống lành — Blog | Hạt Lành",
    description: "Kiến thức ngũ cốc, công thức và bí quyết sống khỏe từ Hạt Lành.",
    type: "website",
  },
};

export default function BlogListPage() {
  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="max-w-2xl mb-10 md:mb-14">
          <h1
            className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
          >
            Góc sống lành
          </h1>
          <p className="text-body text-[17px] leading-[1.65]">
            Kiến thức về ngũ cốc, công thức món ăn lành mạnh và những câu chuyện hay
            cho lối sống khỏe mạnh mỗi ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/goc-song-lanh/${article.slug}`}
              className="group bg-paper rounded-[14px] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
                />
              </div>
              <article className="p-5 md:p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="text-sage font-medium">{article.category}</span>
                  <span className="text-border">·</span>
                  <time className="text-muted" dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString("vi-VN")}
                  </time>
                </div>
                <h2 className="text-ink font-semibold text-[17px] leading-[1.35] group-hover:text-forest transition-colors">
                  {article.title}
                </h2>
                <p className="text-body text-[16px] leading-[1.65]">{article.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
