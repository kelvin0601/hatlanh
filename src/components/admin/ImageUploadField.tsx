"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { ImageIcon, LoaderCircle, Upload } from "lucide-react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

interface ImageUploadFieldProps {
  value: string;
  folder: "products" | "articles" | "categories" | "ingredients" | "pages";
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onUploaded: (url: string, source?: "upload" | "library") => void | Promise<void>;
  onBusyChange?: (busy: boolean) => void;
}

export function ImageUploadField({ value, folder, label = "Ảnh", required = true, disabled = false, onUploaded, onBusyChange }: ImageUploadFieldProps) {
  const { csrfToken } = useAdminSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [optimization, setOptimization] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      setError("Ảnh phải nhỏ hơn hoặc bằng 8 MB.");
      return;
    }

    setUploading(true);
    onBusyChange?.(true);
    setError("");
    setOptimization("");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        body: formData,
      });
      const result = (await response.json()) as { image?: { url?: string; size?: number; originalSize?: number; width?: number; height?: number }; message?: string };
      if (!response.ok || !result.image?.url) throw new Error(result.message ?? "Không thể tải ảnh lên.");
      await onUploaded(result.image.url, "upload");
      if (result.image.size && result.image.originalSize) {
        const reduction = Math.max(0, Math.round((1 - result.image.size / result.image.originalSize) * 100));
        const dimensions = result.image.width && result.image.height ? ` · ${result.image.width}×${result.image.height}px` : "";
        setOptimization(`Đã tối ưu WebP ${reduction}%${dimensions}`);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Không thể tải ảnh lên.");
    } finally {
      setUploading(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="text-[13px] font-semibold text-ink">{label}{required ? " *" : ""}</span>
      <div className="mt-1.5 grid gap-3 rounded-[12px] border border-border bg-cream p-3 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[9px] bg-sand">
          {value ? <Image src={value} alt="Xem trước ảnh đã chọn" fill sizes="144px" className="object-cover" /> : <ImageIcon className="absolute inset-0 m-auto h-8 w-8 text-muted/50" />}
        </div>
        <div className="min-w-0">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={disabled || uploading} className="sr-only" />
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} disabled={disabled || uploading} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/25 bg-paper px-4 text-[13px] font-semibold text-forest hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-60">
            {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Đang tải lên R2…" : value ? "Thay ảnh" : "Tải ảnh mới"}
          </button><MediaLibraryPicker initialFolder={folder} disabled={disabled || uploading} selectedUrls={value ? [value] : []} onSelect={async (url) => { await onUploaded(url, "library"); setOptimization("Đã chọn ảnh từ thư viện Cloudflare."); setError(""); }} /></div>
          <p className="mt-2 text-[11px] leading-5 text-muted">JPEG, PNG, WebP hoặc AVIF · tối đa 8 MB.</p>
          {value ? <p className="mt-1 truncate text-[11px] text-muted" title={value}>{value}</p> : null}
          {optimization ? <p className="mt-1 text-[11px] font-medium text-forest">{optimization}</p> : null}
          {error ? <p role="alert" className="mt-2 text-[12px] text-error">{error}</p> : null}
        </div>
      </div>
      <input type="hidden" required={required} value={value} readOnly />
    </div>
  );
}
