"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/commerce/ProductCard";

type SortOption = "default" | "price-asc" | "price-desc" | "name";
type PriceRange = "all" | "under-150k" | "150k-200k" | "over-200k";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
  { value: "name", label: "Tên A → Z" },
];

const PRICE_FILTERS: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "under-150k", label: "Dưới 150k" },
  { value: "150k-200k", label: "150k – 200k" },
  { value: "over-200k", label: "Trên 200k" },
];

function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
}

function matchesPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case "under-150k": return price < 150_000;
    case "150k-200k": return price >= 150_000 && price <= 200_000;
    case "over-200k": return price > 200_000;
    default: return true;
  }
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc": return sorted.sort((a, b) => a.price - b.price);
    case "price-desc": return sorted.sort((a, b) => b.price - a.price);
    case "name": return sorted.sort((a, b) => removeDiacritics(a.name).localeCompare(removeDiacritics(b.name)));
    default: return sorted;
  }
}

export function ProductFilter({ products }: { products: Product[] }) {
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    const priceFiltered = products.filter((p) => matchesPriceRange(p.price, priceRange));
    return sortProducts(priceFiltered, sort);
  }, [products, priceRange, sort]);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sort)!;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        {/* Price filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-sage" />
          <div className="flex gap-2" role="radiogroup" aria-label="Lọc theo giá">
            {PRICE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="radio"
                aria-checked={priceRange === filter.value}
                onClick={() => setPriceRange(filter.value)}
                className={clsx(
                  "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition-all duration-200",
                  priceRange === filter.value
                    ? "bg-forest text-white shadow-sm"
                    : "bg-paper text-body ring-1 ring-border/60 hover:bg-sand/60 hover:text-ink",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-[13px] font-medium text-body ring-1 ring-border/60 transition-colors hover:bg-sand/60 hover:text-ink"
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {activeSort.label}
          </button>

          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div
                className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-[14px] bg-paper py-1 shadow-[0_12px_36px_rgba(33,55,40,0.12)] ring-1 ring-border/40"
                role="listbox"
                aria-label="Sắp xếp theo"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={sort === option.value}
                    onClick={() => { setSort(option.value); setSortOpen(false); }}
                    className={clsx(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors",
                      sort === option.value
                        ? "bg-forest/[0.06] font-semibold text-forest"
                        : "text-body hover:bg-sand/50",
                    )}
                  >
                    {option.label}
                    {sort === option.value && <Check className="h-4 w-4 text-forest" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results count */}
      {priceRange !== "all" && (
        <p className="mb-4 text-[13px] text-muted">
          Hiển thị {filtered.length} / {products.length} sản phẩm
        </p>
      )}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[14px] bg-paper py-16 text-center">
          <SlidersHorizontal className="h-10 w-10 text-border" />
          <p className="text-[15px] font-medium text-ink">Không có sản phẩm phù hợp</p>
          <button
            type="button"
            onClick={() => { setPriceRange("all"); setSort("default"); }}
            className="text-[13px] font-semibold text-forest hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
