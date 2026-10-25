import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { articles, type Article } from "@/lib/articles";
import { getStoreArticleBySlug, getStoreArticles } from "@/lib/admin-store";
import { slugify } from "@/lib/slugify";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TableOfContents, type TocItem } from "@/components/ui/TableOfContents";

const RELATED_LIMIT = 3;

type ContentBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseContent(content: string): ContentBlock[] {
  const usedIds = new Map<string, number>();
  return content.split("\n\n").map((block) => {
    if (block.startsWith("## ")) {
      const text = block.slice(3).trim();
      const base = slugify(text) || "muc";
      const count = usedIds.get(base) ?? 0;
      usedIds.set(base, count + 1);
      return { type: "heading", id: count ? `${base}-${count + 1}` : base, text };
    }
    if (block.startsWith("- ")) {
      return { type: "list", items: block.split("\n").filter(Boolean).map((item) => item.replace("- ", "")) };
    }
    return { type: "paragraph", text: block };
  });
}

function pickRelated(current: Article, all: Article[]): Article[] {
  const others = all.filter((a) => a.slug !== current.slug);
  return [
    ...others.filter((a) => a.category === current.category),
    ...others.filter((a) => a.category !== current.category),
  ].slice(0, RELATED_LIMIT);
}

function InlineMarkdown({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getStoreArticleBySlug(slug);
  if (!article) return { title: "Bài viết không tồn tại" };

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.category, "sống lành", "dinh dưỡng", "An Vị"],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getStoreArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "An Vị",
    },
  };

  const blocks = parseContent(article.content);
  const toc: TocItem[] = blocks.flatMap((block) => (block.type === "heading" ? [{ id: block.id, text: block.text }] : []));
  const showToc = toc.length >= 2;
  const related = pickRelated(article, await getStoreArticles());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div
            className={clsx(
              "mx-auto",
              showToc ? "max-w-3xl lg:grid lg:max-w-[1088px] lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16" : "max-w-3xl",
            )}
          >
           <div className="min-w-0">
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

            {showToc && (
              <details className="group mb-10 rounded-[14px] bg-paper p-5 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between text-ink font-semibold text-[15px] [&::-webkit-details-marker]:hidden">
                  Mục lục
                  <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <nav aria-label="Mục lục bài viết" className="mt-4">
                  <ol className="flex flex-col gap-2.5 text-[15px] leading-[1.45]">
                    {toc.map((item, index) => (
                      <li key={item.id} className="flex gap-2.5">
                        <span className="text-sage font-semibold tabular-nums">{index + 1}.</span>
                        <a href={`#${item.id}`} className="text-body hover:text-forest">
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>
            )}

            <div className="prose-anvi">
              {blocks.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      id={block.id}
                      className="text-ink leading-[1.25] tracking-[-0.015em] font-medium mt-10 mb-4 scroll-mt-[calc(var(--header-height)+24px)]"
                      style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem" }}
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="list-disc list-inside flex flex-col gap-2 my-4 text-body text-[17px] leading-[1.65]">
                      {block.items.map((item, j) => (
                        <li key={j}><InlineMarkdown text={item} /></li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-body text-[17px] leading-[1.65] mb-4">
                    <InlineMarkdown text={block.text} />
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
                Khám phá sản phẩm An Vị
              </Link>
            </div>
           </div>

            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-[calc(var(--header-height)+32px)]">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paper" style={{ paddingBlock: "var(--section-space)" }} aria-labelledby="related-articles-title">
          <div
            className="mx-auto"
            style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
          >
            <h2
              id="related-articles-title"
              className="text-ink leading-[1.13] tracking-[-0.025em] font-medium mb-8 md:mb-10"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.875rem, 8.5vw, 2.25rem)" }}
            >
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/goc-song-lanh" variant="outline-dark" withArrow>
                Xem tất cả bài viết
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
