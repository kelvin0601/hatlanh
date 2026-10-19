import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { policies, getPolicyBySlug } from "@/lib/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) return { title: "Chính sách | Hạt Lành" };

  return {
    title: `${policy.title} | Hạt Lành`,
    description: `${policy.title} — Chính sách của Hạt Lành, ngũ cốc thiên nhiên.`,
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) notFound();

  const paragraphs = policy.content.split("\n\n");

  return (
    <article className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-forest font-medium text-sm mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Trang chủ
          </Link>

          <h1
            className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-8"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
          >
            {policy.title}
          </h1>

          <div>
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
              if (p.includes("\n- ") || p.startsWith("- ")) {
                const items = p.split("\n").filter((line) => line.startsWith("- "));
                const intro = p.split("\n").find((line) => !line.startsWith("- "));
                return (
                  <div key={i}>
                    {intro && <p className="text-body text-[17px] leading-[1.65] mb-3">{intro}</p>}
                    <ul className="list-disc list-inside flex flex-col gap-2 my-4 text-body text-[16px] leading-[1.65]">
                      {items.map((item, j) => (
                        <li key={j}>{item.replace("- ", "").replace(/\*\*/g, "")}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (/^\d+\./.test(p)) {
                const items = p.split("\n").filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside flex flex-col gap-2 my-4 text-body text-[16px] leading-[1.65]">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}</li>
                    ))}
                  </ol>
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
            <h2
              className="text-ink font-semibold text-[17px] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Các chính sách khác
            </h2>
            <div className="flex flex-wrap gap-2">
              {policies
                .filter((p) => p.slug !== slug)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/chinh-sach/${p.slug}`}
                    className="text-forest text-[14px] font-medium px-4 py-2 rounded-full border border-forest/20 hover:bg-forest/5 transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
