import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { articles, getArticleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Bài viết không tồn tại | Hạt Lành" };

  return {
    title: `${article.title} | Hạt Lành`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "Hạt Lành",
    },
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-3xl mx-auto">
            <Link
              href="/goc-song-lanh"
              className="inline-flex items-center gap-2 text-forest font-medium text-sm mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Tất cả bài viết
            </Link>

            <header className="mb-10">
              <div className="flex items-center gap-3 text-[14px] mb-4">
                <span className="text-sage font-medium">{article.category}</span>
                <span className="text-border">·</span>
                <time className="text-muted" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("vi-VN")}
                </time>
              </div>
              <h1
                className="text-ink leading-[1.12] tracking-[-0.035em] font-medium"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 8vw, 2.75rem)" }}
              >
                {article.title}
              </h1>
            </header>

            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-sand mb-10">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <div className="prose-hatlanh">
              {paragraphs.map((p, i) => {
                if (p.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="text-ink leading-[1.25] tracking-[-0.015em] font-medium mt-10 mb-4"
                      style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem" }}
                    >
                      {p.replace("## ", "")}
                    </h2>
                  );
                }
                if (p.startsWith("- ")) {
                  const items = p.split("\n").filter(Boolean);
                  return (
                    <ul key={i} className="list-disc list-inside flex flex-col gap-2 my-4 text-body text-[17px] leading-[1.65]">
                      {items.map((item, j) => (
                        <li key={j}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-body text-[17px] leading-[1.65] mb-4">
                    {p}
                  </p>
                );
              })}
            </div>

            <div className="border-t border-border mt-12 pt-8">
              <p className="text-muted text-[14px] mb-4">Bạn có thể quan tâm:</p>
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors"
              >
                Khám phá sản phẩm Hạt Lành
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
