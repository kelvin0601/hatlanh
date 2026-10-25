import Image from "next/image";
import { Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { SiteContent } from "@/lib/site-content";

export function StorySection({ content }: { content: SiteContent }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "480px" }}>
      {/* Full-width countryside background */}
      <div className="absolute inset-0">
        <Image
          src={content.storyImage}
          alt={content.storyImageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient left for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(20,43,27,0.92) 0%, rgba(20,43,27,0.68) 38%, rgba(20,43,27,0.2) 66%, transparent 88%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex items-center"
        style={{
          width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))",
          paddingBlock: "var(--section-space)",
        }}
      >
        <div className="max-w-[480px]">
          <p className="text-white/75 text-[12px] font-semibold uppercase tracking-[0.14em] mb-4">
            {content.storyEyebrow}
          </p>
          <h2
            className="text-white leading-[1.08] tracking-[-0.025em] font-medium mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-section-title)",
              color: "white",
            }}
          >
            <span className="whitespace-pre-line">{content.storyTitle}</span>
          </h2>
          <p className="text-white/90 text-[16px] md:text-[17px] leading-[1.7] mb-8 max-w-[400px]">
            {content.storyBody}
          </p>
          <ButtonLink
            href="/cau-chuyen"
            variant="light"
            withArrow
          >
            Xem câu chuyện
          </ButtonLink>
        </div>

        {/* Decorative script text — right side (desktop only) */}
        <div
          className="hidden lg:block absolute right-[8%] top-1/2 -translate-y-1/2 text-white/20 text-[2.5rem] leading-[1.4] italic max-w-[300px]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden="true"
        >
          Những điều lành bắt đầu từ những người từ tế.
        </div>

        {/* Play button */}
        <button
          className="hidden md:flex absolute top-1/2 right-[35%] lg:right-[45%] -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all"
          aria-label="Phát video câu chuyện"
        >
          <Play className="w-6 h-6 text-forest fill-forest ml-0.5" />
        </button>
      </div>
    </section>
  );
}
