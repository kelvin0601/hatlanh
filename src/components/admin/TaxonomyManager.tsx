"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { FolderTree, ImageIcon, LoaderCircle, Pencil, Plus, Save, Trash2, Wheat, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminSession } from "@/components/admin/AdminShell";

export interface ManagedTaxonomyItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  productCount: number;
}

type TaxonomyKind = "categories" | "ingredients";

type ApiTaxonomy = {
  value?: string;
  label?: string;
  description?: string;
  name?: string;
  image?: string;
  imageAlt?: string;
};

const inputClass = "h-11 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function TaxonomyManager({ kind, initialItems }: { kind: TaxonomyKind; initialItems: ManagedTaxonomyItem[] }) {
  const { csrfToken } = useAdminSession();
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ManagedTaxonomyItem | null>(null);
  const [originalId, setOriginalId] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [pending, setPending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState("");

  const isCategory = kind === "categories";
  const singular = isCategory ? "danh mục" : "nguyên liệu";
  const title = isCategory ? "Danh mục sản phẩm" : "Nguyên liệu";
  const Icon = isCategory ? FolderTree : Wheat;

  function openForm(item?: ManagedTaxonomyItem) {
    const value = item ? structuredClone(item) : { id: "", name: "", description: isCategory ? "" : undefined, image: "", imageAlt: "", productCount: 0 };
    setEditing(value);
    setOriginalId(item?.id ?? "");
    setOriginalImage(item?.image ?? "");
    setUploadedImage("");
    setMessage("");
  }

  async function deleteManagedImage(url: string) {
    if (!url.startsWith("https://")) return;
    try {
      await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ url }) });
    } catch {
      // Cleanup is best-effort.
    }
  }

  async function closeForm() {
    if (pending || imageUploading) return;
    const orphan = uploadedImage;
    setEditing(null);
    setUploadedImage("");
    if (orphan && orphan !== originalImage) await deleteManagedImage(orphan);
  }

  async function imageUploaded(url: string, source: "upload" | "library" = "upload") {
    const previousUpload = uploadedImage;
    setUploadedImage(source === "upload" ? url : "");
    setEditing((current) => current ? { ...current, image: url, imageAlt: current.imageAlt || current.name } : current);
    if (previousUpload && previousUpload !== url) await deleteManagedImage(previousUpload);
  }

  function toManaged(value: ApiTaxonomy, productCount: number): ManagedTaxonomyItem {
    return isCategory
      ? { id: value.value!, name: value.label!, description: value.description, image: value.image, imageAlt: value.imageAlt, productCount }
      : { id: value.name!, name: value.name!, image: value.image, imageAlt: value.imageAlt, productCount };
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    setMessage("");
    const isNew = !originalId;
    const data = isCategory
      ? { label: editing.name, description: editing.description, image: editing.image, imageAlt: editing.imageAlt }
      : { name: editing.name, image: editing.image, imageAlt: editing.imageAlt };
    const body = isNew ? data : isCategory ? { value: originalId, data } : { currentName: originalId, data };
    const response = await fetch(`/api/admin/${kind}`, { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify(body) });
    const result = (await response.json()) as { category?: ApiTaxonomy; ingredient?: ApiTaxonomy; message?: string };
    setPending(false);
    const saved = result.category ?? result.ingredient;
    if (!response.ok || !saved) {
      setMessage(result.message ?? `Không thể lưu ${singular}.`);
      return;
    }
    const item = toManaged(saved, editing.productCount);
    setItems((current) => isNew ? [...current, item] : current.map((currentItem) => currentItem.id === originalId ? item : currentItem));
    if (originalImage && originalImage !== item.image) void deleteManagedImage(originalImage);
    setUploadedImage("");
    setEditing(null);
  }

  async function remove(item: ManagedTaxonomyItem) {
    if (!window.confirm(`Xóa ${singular} “${item.name}”?`)) return;
    const body = isCategory ? { value: item.id } : { name: item.id };
    const response = await fetch(`/api/admin/${kind}`, { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify(body) });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      window.alert(result.message ?? `Không thể xóa ${singular}.`);
      return;
    }
    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    if (item.image) void deleteManagedImage(item.image);
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage">Sản phẩm</p><h1 className="mt-0.5 text-2xl font-semibold text-ink">{title}</h1><p className="mt-1 text-[13px] text-muted">{items.length} {singular} đang được quản lý.</p></div><button type="button" onClick={() => openForm()} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-forest px-4 text-[13px] font-semibold text-white hover:bg-forest-hover"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">Thêm {singular}</span><span className="sm:hidden">Thêm</span></button></header>

      {items.length === 0 ? <div className="rounded-[12px] bg-paper px-5 py-12 text-center text-muted">Chưa có {singular}.</div> : <div className={`grid gap-2.5 ${isCategory ? "md:grid-cols-2 2xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}`}>{items.map((item) => <article key={item.id} className="flex min-h-28 overflow-hidden rounded-[12px] bg-paper"><div className="relative w-24 shrink-0 bg-sand sm:w-28">{item.image ? <Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="112px" className="object-cover" /> : <ImageIcon className="absolute inset-0 m-auto h-7 w-7 text-muted/35" />}</div><div className="flex min-w-0 flex-1 flex-col p-3"><div className="flex min-w-0 items-start gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-forest/10 text-forest"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h2 className="truncate text-[14px] font-semibold text-ink" title={item.name}>{item.name}</h2>{item.description ? <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted">{item.description}</p> : null}<p className="mt-1 text-[11px] font-semibold text-sage">{item.productCount} sản phẩm</p></div></div><div className="mt-auto flex justify-end gap-0.5 pt-1"><button type="button" onClick={() => openForm(item)} className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold text-forest hover:bg-forest/10"><Pencil className="h-3 w-3" /> Sửa</button><button type="button" onClick={() => remove(item)} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-error/10 hover:text-error" aria-label={`Xóa ${item.name}`}><Trash2 className="h-3 w-3" /></button></div></div></article>)}</div>}

      {editing ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="taxonomy-form-title"><button type="button" onClick={closeForm} className="absolute inset-0" aria-label="Đóng biểu mẫu" /><form onSubmit={save} className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 id="taxonomy-form-title" className="text-xl font-semibold text-ink">{originalId ? "Sửa" : "Thêm"} {singular}</h2><button type="button" onClick={closeForm} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-[13px] font-semibold text-ink sm:col-span-2">Tên {singular} *<input autoFocus required minLength={2} maxLength={100} value={editing.name} onChange={(event) => setEditing((current) => current ? { ...current, name: event.target.value } : current)} className={`${inputClass} mt-1.5`} /></label>{isCategory ? <label className="text-[13px] font-semibold text-ink sm:col-span-2">Mô tả *<textarea required minLength={10} maxLength={500} rows={4} value={editing.description ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, description: event.target.value } : current)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label> : null}<ImageUploadField value={editing.image ?? ""} folder={isCategory ? "categories" : "ingredients"} required={false} disabled={pending} onUploaded={imageUploaded} onBusyChange={setImageUploading} />{editing.image ? <><label className="text-[13px] font-semibold text-ink sm:col-span-2">Alt ảnh *<input required maxLength={200} value={editing.imageAlt ?? ""} onChange={(event) => setEditing((current) => current ? { ...current, imageAlt: event.target.value } : current)} className={`${inputClass} mt-1.5`} /></label><button type="button" onClick={() => setEditing((current) => current ? { ...current, image: "", imageAlt: "" } : current)} className="justify-self-start text-[12px] font-semibold text-error hover:underline sm:col-span-2">Gỡ ảnh</button></> : null}</div>{message ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{message}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={closeForm} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand">Hủy</button><button type="submit" disabled={pending || imageUploading} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu</button></div></form></div> : null}
    </div>
  );
}
