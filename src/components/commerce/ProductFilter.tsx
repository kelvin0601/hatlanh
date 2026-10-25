"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ChevronDown, ListFilter, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/products";
import type { ProductCategory, ProductCategoryDefinition } from "@/lib/product-categories";
import type { ProductIngredientDefinition } from "@/lib/product-ingredients";
import { ProductCard } from "@/components/commerce/ProductCard";

type SortOption = "default" | "price-asc" | "price-desc" | "name";
type PriceRange = "all" | "under-150k" | "150k-200k" | "over-200k";

interface FilterState {
  category: "all" | ProductCategory;
  ingredient: string;
  priceRange: PriceRange;
  sort: SortOption;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
  { value: "name", label: "Tên A → Z" },
];

const PRICE_FILTERS: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-150k", label: "Dưới 150.000đ" },
  { value: "150k-200k", label: "150.000đ – 200.000đ" },
  { value: "over-200k", label: "Trên 200.000đ" },
];

const fieldClass = "h-11 w-full rounded-[11px] border border-white/15 bg-white/[0.06] px-4 text-[14px] font-medium text-white outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10";

function removeDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();
}

function matchesPriceRange(price: number, range: PriceRange) {
  if (range === "under-150k") return price < 150_000;
  if (range === "150k-200k") return price >= 150_000 && price <= 200_000;
  if (range === "over-200k") return price > 200_000;
  return true;
}

function sortProducts(products: Product[], sort: SortOption) {
  const sorted = [...products];
  if (sort === "price-asc") return sorted.sort((left, right) => left.price - right.price);
  if (sort === "price-desc") return sorted.sort((left, right) => right.price - left.price);
  if (sort === "name") return sorted.sort((left, right) => removeDiacritics(left.name).localeCompare(removeDiacritics(right.name)));
  return sorted;
}

type FilterPanelProps = {
  categories: ProductCategoryDefinition[];
  ingredients: ProductIngredientDefinition[];
  draft: FilterState;
  idPrefix: string;
  onChange: (changes: Partial<FilterState>) => void;
  onApply: () => void;
  onReset: () => void;
  onClose?: () => void;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative">
      <p className="text-[13px] font-semibold text-white/60">{label}</p>
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="listbox" className={`${fieldClass} relative mt-1.5 flex items-center pr-12 text-left`}>
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={`absolute right-4 h-4 w-4 text-white/80 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <><button type="button" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-label={`Đóng danh sách ${label.toLowerCase()}`} /><div className="absolute inset-x-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-[12px] bg-paper p-1.5 text-ink shadow-[0_16px_40px_rgba(10,25,17,0.28)] ring-1 ring-border" role="listbox" aria-label={label}>{options.map((option) => { const active = option.value === value; return <button key={option.value} type="button" role="option" aria-selected={active} onClick={() => { onChange(option.value); setOpen(false); }} className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-[9px] px-3 text-left text-[14px] transition-colors ${active ? "bg-forest text-white" : "text-body hover:bg-sand"}`}><span>{option.label}</span>{active ? <Check className="h-4 w-4 shrink-0" /> : null}</button>; })}</div></> : null}
    </div>
  );
}

function FilterPanel({ categories, ingredients, draft, idPrefix, onChange, onApply, onReset, onClose }: FilterPanelProps) {
  return (
    <div className="rounded-[18px] bg-ink p-4 text-white shadow-[0_18px_50px_rgba(33,55,40,0.16)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ListFilter className="h-5 w-5 text-[#b9d4ad]" /> Bộ lọc</h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onReset} className="min-h-10 px-2 text-[13px] font-semibold text-[#c7ddbe] hover:text-white">Xóa bộ lọc</button>
          {onClose ? <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Đóng bộ lọc"><X className="h-5 w-5" /></button> : null}
        </div>
      </div>

      <div className="space-y-4">
        <FilterSelect label="Danh mục" value={draft.category} options={[{ value: "all", label: "Tất cả danh mục" }, ...categories.map((category) => ({ value: category.value, label: category.label }))]} onChange={(category) => onChange({ category })} />

        <label className="block text-[13px] font-semibold text-white/60">Nguyên liệu<div className="relative mt-1.5"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" /><input list={`${idPrefix}-ingredients`} value={draft.ingredient} onChange={(event) => onChange({ ingredient: event.target.value })} className={`${fieldClass} pl-11`} placeholder="Tìm yến mạch, hạt chia..." /><datalist id={`${idPrefix}-ingredients`}>{ingredients.map((ingredient) => <option key={ingredient.name} value={ingredient.name} />)}</datalist></div></label>

        <FilterSelect label="Giá tiền" value={draft.priceRange} options={PRICE_FILTERS} onChange={(priceRange) => onChange({ priceRange: priceRange as PriceRange })} />

        <FilterSelect label="Sắp xếp" value={draft.sort} options={SORT_OPTIONS} onChange={(sort) => onChange({ sort: sort as SortOption })} />
      </div>

      <button type="button" onClick={onApply} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[11px] bg-[#dcebd5] px-5 text-[15px] font-bold text-ink transition hover:bg-white">Áp dụng</button>
    </div>
  );
}

type ProductFilterProps = {
  products: Product[];
  categories: ProductCategoryDefinition[];
  ingredients: ProductIngredientDefinition[];
  activeCategory?: ProductCategory;
};

export function ProductFilter({ products, categories, ingredients, activeCategory }: ProductFilterProps) {
  const searchParams = useSearchParams();
  const initialIngredient = searchParams.get("ingredient")?.trim() ?? "";
  const initialFilters: FilterState = { category: activeCategory ?? "all", ingredient: initialIngredient, priceRange: "all", sort: "default" };
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const ingredientQuery = removeDiacritics(applied.ingredient.trim());
    const matched = products.filter((product) => {
      if (applied.category !== "all" && product.category !== applied.category) return false;
      if (!matchesPriceRange(product.price, applied.priceRange)) return false;
      if (ingredientQuery && !product.ingredients.some((ingredient) => removeDiacritics(ingredient).includes(ingredientQuery))) return false;
      return true;
    });
    return sortProducts(matched, applied.sort);
  }, [applied, products]);

  const isFiltered = applied.category !== "all" || applied.ingredient.trim() !== "" || applied.priceRange !== "all";

  function changeDraft(changes: Partial<FilterState>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function applyFilters() {
    setApplied({ ...draft, ingredient: draft.ingredient.trim() });
    setMobileOpen(false);
  }

  function resetFilters() {
    const reset: FilterState = { category: "all", ingredient: "", priceRange: "all", sort: "default" };
    setDraft(reset);
    setApplied(reset);
  }

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <aside className="sticky top-[calc(var(--header-height)+24px)] hidden lg:block">
        <FilterPanel categories={categories} ingredients={ingredients} draft={draft} idPrefix="desktop" onChange={changeDraft} onApply={applyFilters} onReset={resetFilters} />
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-[13px] text-muted">Hiển thị <span className="font-semibold text-ink">{filtered.length}</span> / {products.length} sản phẩm</p>
          <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold text-white lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Bộ lọc{isFiltered ? <span className="h-2 w-2 rounded-full bg-[#dcebd5]" /> : null}</button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[14px] bg-paper py-16 text-center">
            <SlidersHorizontal className="h-10 w-10 text-border" />
            <p className="text-[15px] font-medium text-ink">Không có sản phẩm phù hợp</p>
            <button type="button" onClick={resetFilters} className="text-[13px] font-semibold text-forest hover:underline">Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>

      {mobileOpen ? <div className="fixed inset-0 z-[90] flex items-end bg-ink/45 p-0 lg:hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm"><button type="button" onClick={() => setMobileOpen(false)} className="absolute inset-0" aria-label="Đóng bộ lọc" /><div className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-[22px]"><FilterPanel categories={categories} ingredients={ingredients} draft={draft} idPrefix="mobile" onChange={changeDraft} onApply={applyFilters} onReset={resetFilters} onClose={() => setMobileOpen(false)} /></div></div> : null}
    </div>
  );
}
