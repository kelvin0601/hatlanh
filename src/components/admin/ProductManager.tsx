"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useAdminSession } from "@/components/admin/AdminShell";

const emptyProduct: Product = { id: 0, slug: "", name: "", shortName: "", weight: "", price: 0, description: "", image: "/images/04_products/product-traditional-hd.jpg", imageAlt: "", ingredients: [], usage: "", storage: "Bảo quản nơi khô ráo, thoáng mát. Đậy kín sau khi mở." };
const inputClass = "h-11 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const { csrfToken } = useAdminSession();
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function openForm(product?: Product) {
    const value = product ? structuredClone(product) : structuredClone(emptyProduct);
    setEditing(value);
    setIngredients(value.ingredients.join(", "));
    setMessage("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    setMessage("");
    const isNew = editing.id === 0;
    const product = { ...editing, ingredients: ingredients.split(",").map((item) => item.trim()).filter(Boolean) };
    const response = await fetch("/api/admin/data", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "products", id: editing.id, data: product }) });
    const result = (await response.json()) as { item?: Product; message?: string };
    setPending(false);
    if (!response.ok || !result.item) { setMessage(result.message ?? "Không thể lưu sản phẩm."); return; }
    setProducts((current) => isNew ? [...current, result.item!] : current.map((item) => item.id === result.item!.id ? result.item! : item));
    setEditing(null);
  }

  async function remove(product: Product) {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”? Thao tác này không thể hoàn tác.`)) return;
    const response = await fetch("/api/admin/data", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "products", id: product.id }) });
    if (response.ok) setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex items-end justify-between gap-3"><div><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Danh mục</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Sản phẩm</h1><p className="mt-2 text-[14px] text-muted">{products.length} sản phẩm đang hiển thị trên website.</p></div><button type="button" onClick={() => openForm()} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-4 text-[14px] font-semibold text-white hover:bg-forest-hover"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Thêm sản phẩm</span><span className="sm:hidden">Thêm</span></button></header>
      {products.length === 0 ? <div className="rounded-[14px] bg-paper px-5 py-16 text-center text-muted">Chưa có sản phẩm.</div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <article key={product.id} className="flex gap-3 rounded-[14px] bg-paper p-3 sm:p-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-sand"><Image src={product.image} alt="" fill sizes="80px" className="object-cover" /></div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-[14px] font-semibold leading-5 text-ink">{product.name}</h2><p className="mt-1 text-[12px] text-muted">{product.weight} · {formatPrice(product.price)}</p><div className="mt-2 flex gap-1"><button type="button" onClick={() => openForm(product)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[12px] font-semibold text-forest hover:bg-forest/10"><Pencil className="h-3.5 w-3.5" /> Sửa</button><button type="button" onClick={() => remove(product)} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-error/10 hover:text-error" aria-label={`Xóa ${product.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div>}

      {editing ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="product-form-title"><button type="button" onClick={() => setEditing(null)} className="absolute inset-0" aria-label="Đóng biểu mẫu" /><form onSubmit={save} className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 id="product-form-title" className="text-xl font-semibold text-ink">{editing.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2><button type="button" onClick={() => setEditing(null)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-ink">Tên sản phẩm *<input required value={editing.name} onChange={(event) => update("name", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Tên ngắn *<input required value={editing.shortName} onChange={(event) => update("shortName", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Slug *<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={editing.slug} onChange={(event) => update("slug", event.target.value)} className={`${inputClass} mt-1.5`} placeholder="ngu-coc-moi" /></label>
        <label className="text-[13px] font-semibold text-ink">Khối lượng *<input required value={editing.weight} onChange={(event) => update("weight", event.target.value)} className={`${inputClass} mt-1.5`} placeholder="500g" /></label>
        <label className="text-[13px] font-semibold text-ink">Giá bán *<input required type="number" inputMode="numeric" min={1000} step={1000} value={editing.price || ""} onChange={(event) => update("price", Number(event.target.value))} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Đường dẫn ảnh *<input required value={editing.image} onChange={(event) => update("image", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Alt ảnh *<input required value={editing.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Mô tả *<textarea required rows={3} value={editing.description} onChange={(event) => update("description", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Thành phần, phân cách bằng dấu phẩy *<input required value={ingredients} onChange={(event) => setIngredients(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Cách dùng *<textarea required rows={3} value={editing.usage} onChange={(event) => update("usage", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Bảo quản *<textarea required rows={2} value={editing.storage} onChange={(event) => update("storage", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
      </div>{message ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{message}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand">Hủy</button><button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu sản phẩm</button></div></form></div> : null}
    </div>
  );
}
