import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/goc-song-lanh/${article.slug}`}
      className="group block h-full overflow-hidden rounded-[14px] bg-paper transition-shadow hover:shadow-[var(--shadow-soft)]"
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
  );
}
