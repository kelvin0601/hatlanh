import Link from "next/link";
import { getStoreArticles } from "@/lib/admin-store";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { DotCarousel } from "@/components/ui/DotCarousel";
import type { SiteContent } from "@/lib/site-content";

export async function JournalSection({ content }: { content: SiteContent }) {
  const articles = await getStoreArticles();
  return (
    <section className="overflow-hidden bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="flex items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-sage text-[13px] font-semibold uppercase tracking-[0.14em] mb-3">
              {content.journalEyebrow}
            </p>
            <h2
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-section-title)",
              }}
            >
              {content.journalTitle}
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

        <div className="md:hidden">
          <DotCarousel label="Bài viết góc sống lành">
            {articles.map((article, index) => (
              <div
                key={article.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${articles.length}`}
                className="min-w-0 shrink-0 grow-0 basis-[88%] pl-5"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </DotCarousel>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </div>
    </section>
  );
}
