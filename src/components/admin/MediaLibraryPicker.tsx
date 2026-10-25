"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Images, LoaderCircle, Search, X } from "lucide-react";

type MediaFolder = "products" | "articles" | "categories" | "ingredients" | "pages";
type MediaItem = { key: string; url: string; folder: string; filename: string; size: number; lastModified: string | null };

const folders: { value: "" | MediaFolder; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "products", label: "Sản phẩm" },
  { value: "articles", label: "Bài viết" },
  { value: "categories", label: "Danh mục" },
  { value: "ingredients", label: "Nguyên liệu" },
  { value: "pages", label: "Nội dung trang" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibraryPicker({ initialFolder, disabled, selectedUrls = [], onSelect }: { initialFolder: MediaFolder; disabled?: boolean; selectedUrls?: string[]; onSelect: (url: string, filename: string) => void | Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState<"" | MediaFolder>(initialFolder);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const selected = useMemo(() => new Set(selectedUrls), [selectedUrls]);
  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return normalized ? items.filter((item) => item.filename.toLocaleLowerCase("vi").includes(normalized)) : items;
  }, [items, query]);

  async function load(folderValue: "" | MediaFolder, reset: boolean, nextCursor?: string | null) {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ list: "1" });
    if (folderValue) params.set("folder", folderValue);
    if (nextCursor) params.set("cursor", nextCursor);
    try {
      const response = await fetch(`/api/admin/media?${params.toString()}`, { cache: "no-store" });
      const result = (await response.json()) as { images?: MediaItem[]; cursor?: string | null; hasMore?: boolean; message?: string };
      if (!response.ok || !result.images) throw new Error(result.message ?? "Không thể tải thư viện ảnh.");
      setItems((current) => reset ? result.images! : [...current, ...result.images!]);
      setCursor(result.cursor ?? null);
      setHasMore(Boolean(result.hasMore));
      setLoaded(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải thư viện ảnh.");
    } finally {
      setLoading(false);
    }
  }

  function showLibrary() {
    setOpen(true);
    if (!loaded) void load(folder, true);
  }

  function changeFolder(value: "" | MediaFolder) {
    setFolder(value);
    setQuery("");
    void load(value, true);
  }

  async function choose(item: MediaItem) {
    await onSelect(item.url, item.filename);
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={showLibrary} disabled={disabled} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/25 bg-paper px-4 text-[13px] font-semibold text-forest hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-60"><Images className="h-4 w-4" /> Thư viện</button>
      {open ? <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="media-library-title">
        <button type="button" onClick={() => setOpen(false)} className="absolute inset-0" aria-label="Đóng thư viện ảnh" />
        <div className="relative flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-paper shadow-2xl sm:rounded-2xl">
          <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5"><div><h2 id="media-library-title" className="text-lg font-semibold text-ink">Thư viện Cloudflare</h2><p className="mt-0.5 text-[11px] text-muted">Chọn ảnh đã upload để sử dụng lại.</p></div><button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></header>
          <div className="grid gap-2 border-b border-border p-3 sm:grid-cols-[12rem_1fr] sm:p-4"><select value={folder} onChange={(event) => changeFolder(event.target.value as "" | MediaFolder)} className="h-11 rounded-[10px] border border-border bg-cream px-3 text-[13px] font-semibold text-ink outline-none"><option value="">Tất cả thư mục</option>{folders.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên tệp…" className="h-11 w-full rounded-[10px] border border-border bg-cream pl-10 pr-3 text-[13px] outline-none focus:border-forest" /></label></div>
          <div className="min-h-64 flex-1 overflow-y-auto p-3 sm:p-4">
            {loading && items.length === 0 ? <div className="grid min-h-64 place-items-center text-muted"><LoaderCircle className="h-7 w-7 animate-spin" /></div> : null}
            {!loading && !error && visibleItems.length === 0 ? <div className="grid min-h-64 place-items-center text-center text-[13px] text-muted">Không tìm thấy ảnh.</div> : null}
            {error ? <div className="grid min-h-64 place-items-center text-center"><div><p className="text-[13px] text-error">{error}</p><button type="button" onClick={() => load(folder, true)} className="mt-3 rounded-full bg-forest px-4 py-2 text-[12px] font-semibold text-white">Thử lại</button></div></div> : null}
            {visibleItems.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{visibleItems.map((item) => { const isSelected = selected.has(item.url); return <button key={item.key} type="button" onClick={() => choose(item)} className={`group overflow-hidden rounded-[11px] border text-left transition ${isSelected ? "border-forest ring-2 ring-forest/20" : "border-border hover:border-forest/50"}`}><div className="relative aspect-square bg-sand"><Image src={item.url} alt={item.filename} fill sizes="180px" className="object-cover" />{isSelected ? <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-forest text-white"><Check className="h-3.5 w-3.5" /></span> : null}</div><div className="p-2"><p className="truncate text-[11px] font-semibold text-ink" title={item.filename}>{item.filename}</p><p className="mt-0.5 text-[10px] text-muted">{formatSize(item.size)}</p></div></button>; })}</div> : null}
            {hasMore && !query ? <div className="mt-4 text-center"><button type="button" onClick={() => load(folder, false, cursor)} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-forest/20 px-4 text-[12px] font-semibold text-forest disabled:opacity-50">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null} Xem thêm</button></div> : null}
          </div>
        </div>
      </div> : null}
    </>
  );
}
