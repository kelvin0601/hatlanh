"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export type TocItem = { id: string; text: string };

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) + 48;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - offset > 0) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="Mục lục bài viết">
      <p className="text-ink font-semibold text-[14px] mb-4">Mục lục</p>
      <ol className="flex flex-col border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "location" : undefined}
              className={clsx(
                "-ml-px block border-l-2 py-1.5 pl-4 text-[14px] leading-[1.45] transition-colors",
                item.id === activeId
                  ? "border-forest font-semibold text-forest"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
