"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, Images, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
type GalleryImage = { url: string; alt: string };

function parseGallery(value: string): GalleryImage[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is GalleryImage => typeof item?.url === "string" && typeof item?.alt === "string") : [];
  } catch {
    return [];
  }
}

export function GalleryUploadField({ value, label, disabled, onChange, onBusyChange }: { value: string; label: string; disabled?: boolean; onChange: (value: string) => void; onBusyChange?: (busy: boolean) => void }) {
  const { csrfToken } = useAdminSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const images = parseGallery(value);

  function commit(next: GalleryImage[]) {
    onChange(JSON.stringify(next));
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (images.length + files.length > 30) return setError("Thư viện hỗ trợ tối đa 30 ảnh.");
    if (files.some((file) => file.size === 0 || file.size > MAX_IMAGE_BYTES)) return setError("Mỗi ảnh phải nhỏ hơn hoặc bằng 8 MB.");

    setUploading(true);
    onBusyChange?.(true);
    setError("");
    const next = [...images];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Đang tối ưu ảnh ${index + 1}/${files.length}…`);
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", "pages");
        const response = await fetch("/api/admin/media", { method: "POST", headers: { "X-CSRF-Token": csrfToken }, body: formData });
        const result = (await response.json()) as { image?: { url?: string }; message?: string };
        if (!response.ok || !result.image?.url) throw new Error(result.message ?? "Không thể tải ảnh lên.");
        next.push({ url: result.image.url, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") });
        commit(next);
      }
      setProgress(`Đã thêm ${files.length} ảnh WebP đã tối ưu.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Không thể tải ảnh lên.");
    } finally {
      setUploading(false);
      onBusyChange?.(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between gap-3"><span className="text-[13px] font-semibold text-ink">{label}</span><span className="text-[11px] text-muted">{images.length}/30 ảnh</span></div>
      <div className="mt-1.5 rounded-[12px] border border-border bg-cream p-3">
        {images.length ? <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{images.map((item, index) => <div key={`${item.url}-${index}`} className="overflow-hidden rounded-[10px] border border-border bg-paper"><div className="relative aspect-[16/9] bg-sand"><Image src={item.url} alt={item.alt} fill sizes="240px" className="object-cover" /></div><div className="p-2"><input value={item.alt} maxLength={200} onChange={(event) => commit(images.map((image, imageIndex) => imageIndex === index ? { ...image, alt: event.target.value } : image))} placeholder="Alt ảnh" className="h-9 w-full rounded-[8px] border border-border bg-cream px-2 text-[12px] outline-none focus:border-forest" /><div className="mt-1 flex justify-end"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-sand disabled:opacity-25" aria-label="Đưa ảnh sang trái"><ArrowLeft className="h-3.5 w-3.5" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-sand disabled:opacity-25" aria-label="Đưa ảnh sang phải"><ArrowRight className="h-3.5 w-3.5" /></button><button type="button" onClick={() => commit(images.filter((_, imageIndex) => imageIndex !== index))} className="grid h-8 w-8 place-items-center rounded-full text-error hover:bg-error/10" aria-label="Gỡ ảnh"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>)}</div> : <div className="grid min-h-28 place-items-center text-center text-muted"><div><Images className="mx-auto h-7 w-7 opacity-50" /><p className="mt-2 text-[12px]">Chưa có ảnh trong thư viện.</p></div></div>}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3"><input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={disabled || uploading} className="sr-only" /><button type="button" onClick={() => inputRef.current?.click()} disabled={disabled || uploading || images.length >= 30} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/25 bg-paper px-4 text-[12px] font-semibold text-forest disabled:opacity-50">{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Tải nhiều ảnh mới</button><MediaLibraryPicker initialFolder="pages" disabled={disabled || uploading || images.length >= 30} selectedUrls={images.map((item) => item.url)} onSelect={(url, filename) => { if (images.some((item) => item.url === url)) return; commit([...images, { url, alt: filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") }]); setProgress("Đã thêm ảnh từ thư viện Cloudflare."); setError(""); }} /><p className="w-full text-[11px] text-muted">Từ 7 ảnh sẽ tự chạy marquee 2 hàng.</p></div>
        {progress ? <p className="mt-2 text-[11px] font-medium text-forest">{progress}</p> : null}{error ? <p className="mt-2 text-[12px] text-error">{error}</p> : null}
      </div>
    </div>
  );
}
