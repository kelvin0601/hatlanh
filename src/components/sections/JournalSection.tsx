import Link from "next/link";
import { articles } from "@/lib/articles";

const articleGradients: Record<string, string> = {
  "bua-sang-lanh-manh-voi-ngu-coc": "linear-gradient(140deg, #F8F4EA 0%, #EDE4D5 30%, #C69A62 70%, #a07840 100%)",
  "cach-bao-quan-ngu-coc": "linear-gradient(140deg, #d8e0c8 0%, #b0c098 30%, #798B6C 70%, #506050 100%)",
  "5-cong-thuc-ngu-coc-don-gian": "linear-gradient(140deg, #EDE4D5 0%, #c4a880 30%, #25452F 75%, #1a3020 100%)",
};

export function JournalSection() {
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
                <div
                  className="w-full h-full transition-transform duration-[400ms] group-hover:scale-[1.03]"
                  style={{
                    background: articleGradients[article.slug] ?? "linear-gradient(140deg, #EDE4D5 0%, #C69A62 50%, #25452F 100%)",
                  }}
                >
                  {/* Subtle shimmer highlight */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                    }}
                  />
                </div>
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
