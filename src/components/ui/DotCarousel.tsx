"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

type DotCarouselProps = {
  children: ReactNode;
  label: string;
  className?: string;
};

export function DotCarousel({ children, label, className }: DotCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [selected, setSelected] = useState(0);
  const snapCount = Children.count(children);

  const updateSelected = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const viewportLeft = viewport.getBoundingClientRect().left;
    const slides = Array.from(track.children) as HTMLElement[];
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - viewportLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setSelected(nearestIndex);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(updateSelected);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [updateSelected]);

  function handleScroll() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateSelected);
  }

  function scrollTo(index: number) {
    const viewport = viewportRef.current;
    const slide = trackRef.current?.children.item(index) as HTMLElement | null;
    if (!viewport || !slide) return;

    const left = slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
    viewport.scrollTo({ left, behavior: "smooth" });
  }

  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className={clsx(
          "relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          snapCount > 1 && "snap-x snap-mandatory",
        )}
      >
        <div ref={trackRef} className="-ml-5 flex pl-[var(--page-gutter)] after:block after:w-[var(--page-gutter)] after:shrink-0 after:content-[''] [&>*]:snap-start md:-ml-6">{children}</div>
      </div>

      <div className="mt-5 flex h-6 items-center justify-center gap-2 md:mt-7">
        {snapCount > 1 &&
          Array.from({ length: snapCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Đến trang ${index + 1} / ${snapCount}`}
              aria-current={index === selected ? "true" : undefined}
              className="grid h-6 place-items-center"
            >
              <span
                className={clsx(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300",
                  index === selected ? "w-4 bg-forest" : "w-1.5 bg-border hover:bg-sage",
                )}
              />
            </button>
          ))}
      </div>
    </div>
  );
}
