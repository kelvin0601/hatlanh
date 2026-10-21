import Link from "next/link";
import Image from "next/image";
import { getStoreArticles } from "@/lib/admin-store";

export async function JournalSection() {
  const articles = await getStoreArticles();
  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="flex items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-sage text-[13px] font-semibold uppercase tracking-[0.14em] mb-3">
              Blog
            </p>
            <h2
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              }}
            >
              Chuyện hạt lành, chuyện sống an
            </h2>
          </div>
          <Link
            href="/goc-song-lanh"
            className="hidden sm:inline-flex items-center gap-1.5 text-forest font-semibold text-[14px] whitespace-nowrap hover:gap-2.5 transition-all"
          >
            Xem bài viết
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/goc-song-lanh/${article.slug}`}
              className="group bg-paper rounded-[14px] overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4 md:p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="text-sage font-semibold">{article.category}</span>
                  <span className="text-border">·</span>
                  <time className="text-muted" dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString("vi-VN")}
                  </time>
                </div>
                <h3 className="text-ink font-semibold text-[16px] md:text-[17px] leading-[1.35] line-clamp-2 group-hover:text-forest transition-colors">
                  {article.title}
                </h3>
                <p className="text-body text-[15px] leading-[1.6] line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
