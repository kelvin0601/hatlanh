import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function MindfulSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Full-width breakfast lifestyle background */}
      <div className="absolute inset-0">
        <Image
          src="/images/05_lifestyle/breakfast-banner-hd.jpg"
          alt="Bữa sáng ngũ cốc bên tách trà và trang sách"
          fill
          sizes="100vw"
          className="object-cover object-center md:object-[65%_55%]"
        />
        {/* Left dark overlay for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(24,46,30,0.88) 0%, rgba(24,46,30,0.62) 38%, rgba(24,46,30,0.12) 70%, transparent 90%)",
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
          <p className="text-white/75 text-[12px] font-semibold uppercase tracking-[0.2em] mb-4">
            A moment of calm
          </p>
          <h2
            className="text-white leading-[1.08] tracking-[-0.025em] font-medium mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              color: "white",
            }}
          >
            Một chút an yên
            <br />
            cho mỗi ngày
          </h2>
          <p className="text-white/90 text-[16px] md:text-[17px] leading-[1.7] mb-8 max-w-[420px]">
            Giữa những bận bề thường nhật, hãy dành một chút thời gian cho bản thân.
            Một bữa ăn giản dị, một tách trà ấm và những hạt ngũ cốc lành
            — để nuôi dưỡng cả thân và tâm.
          </p>
          <ButtonLink
            href="/goc-song-lanh"
            variant="light"
            withArrow
          >
            Khám phá công thức
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
