"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

function removeDiacritics(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

function scoreMatch(product: Product, query: string): number {
  const q = removeDiacritics(query);
  const name = removeDiacritics(product.name);
  const shortName = removeDiacritics(product.shortName);
  const desc = removeDiacritics(product.description);
  const ingredients = product.ingredients.map(removeDiacritics);

  if (name === q || shortName === q) return 100;
  if (name.startsWith(q) || shortName.startsWith(q)) return 90;
  if (name.includes(q)) return 70;
  if (shortName.includes(q)) return 65;
  if (ingredients.some((ing) => ing.includes(q))) return 50;
  if (desc.includes(q)) return 30;

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allFields = [name, shortName, desc, ...ingredients].join(" ");
    const matched = words.filter((w) => allFields.includes(w));
    if (matched.length > 0) return (matched.length / words.length) * 40;
  }

  return 0;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export function SearchOverlay({ open, onClose, products }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? products
        .map((p) => ({ product: p, score: scoreMatch(p, query.trim()) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  const popularProducts = products.slice(0, 3);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const displayItems = query.trim().length > 0 ? results.map((r) => r.product) : popularProducts;
  const maxIndex = displayItems.length - 1;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, maxIndex));
      scrollToActive(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      scrollToActive(activeIndex - 1);
    } else if (e.key === "Enter" && displayItems[activeIndex]) {
      e.preventDefault();
      const slug = displayItems[activeIndex].slug;
      handleClose();
      window.location.href = `/san-pham/${slug}`;
    }
  }

  function scrollToActive(index: number) {
    const container = listRef.current;
    if (!container) return;
    const item = container.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }

  return (
    <div
      className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative flex items-start justify-center px-4 pt-[min(12vh,120px)] sm:pt-[min(18vh,160px)]">
        <div
          className={`search-panel w-full max-w-[580px] overflow-hidden rounded-[20px] bg-paper shadow-[0_25px_60px_rgba(33,55,40,0.22)] ring-1 ring-border/50 transition-all duration-300 ${open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-4"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm sản phẩm"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border/60 px-5">
            <Search className="h-5 w-5 shrink-0 text-sage" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm sản phẩm, thành phần..."
              className="h-14 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70"
              autoComplete="off"
              spellCheck={false}
              tabIndex={open ? 0 : -1}
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink"
                aria-label="Xóa từ khóa"
                tabIndex={open ? 0 : -1}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="hidden h-7 items-center rounded-[8px] border border-border/80 bg-cream/80 px-2 text-[11px] font-medium text-muted sm:flex"
              tabIndex={open ? 0 : -1}
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[min(50vh,400px)] overflow-y-auto overscroll-contain">
            {query.trim().length > 0 && results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                <Search className="h-10 w-10 text-border" />
                <p className="text-[15px] font-medium text-ink">
                  Không tìm thấy &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="text-[13px] text-muted">
                  Thử từ khóa khác hoặc xem tất cả sản phẩm
                </p>
                <Link
                  href="/san-pham"
                  onClick={handleClose}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[13px] font-semibold text-white hover:bg-forest-hover"
                  tabIndex={open ? 0 : -1}
                >
                  Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                {/* Section label */}
                <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                  {query.trim().length > 0 ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-wheat" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage">
                        {results.length} kết quả
                      </p>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-wheat" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage">
                        Phổ biến
                      </p>
                    </>
                  )}
                </div>

                {/* Product list */}
                <div ref={listRef} role="listbox" aria-label="Kết quả tìm kiếm">
                  {displayItems.map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/san-pham/${product.slug}`}
                      onClick={handleClose}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-4 px-5 py-3 transition-colors duration-150 ${
                        index === activeIndex
                          ? "bg-forest/[0.06]"
                          : "hover:bg-sand/50"
                      }`}
                      tabIndex={-1}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-sand">
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">
                          {product.name}
                        </p>
                        <p className="truncate text-[13px] text-muted">
                          {product.weight} · {product.ingredients.slice(0, 3).join(", ")}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[15px] font-bold tabular-nums text-ink">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      {index === activeIndex && (
                        <ArrowRight className="h-4 w-4 shrink-0 text-forest" />
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
            <Link
              href="/san-pham"
              onClick={handleClose}
              className="flex items-center gap-1.5 text-[13px] font-medium text-forest hover:underline"
              tabIndex={open ? 0 : -1}
            >
              Tất cả sản phẩm <ArrowRight className="h-3 w-3" />
            </Link>
            <div className="hidden items-center gap-3 text-[11px] text-muted sm:flex">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center rounded-[4px] border border-border/80 bg-cream/80 px-1.5 text-[10px] font-medium">↑↓</kbd>
                di chuyển
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center rounded-[4px] border border-border/80 bg-cream/80 px-1.5 text-[10px] font-medium">↵</kbd>
                chọn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
