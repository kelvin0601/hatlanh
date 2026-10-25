"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { FolderPlus, LoaderCircle, Pencil, Plus, Save, Trash2, Wheat, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { DEFAULT_PRODUCT_CATEGORY, getCategoryLabel, type ProductCategory, type ProductCategoryDefinition } from "@/lib/product-categories";
import { useAdminSession } from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { ProductIngredientDefinition } from "@/lib/product-ingredients";

const emptyProduct: Product = { id: 0, slug: "", name: "", shortName: "", category: DEFAULT_PRODUCT_CATEGORY, weight: "", price: 0, description: "", image: "", imageAlt: "", ingredients: [], usage: "", storage: "Bảo quản nơi khô ráo, thoáng mát. Đậy kín sau khi mở." };
const inputClass = "h-11 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function ProductManager({ initialProducts, initialCategories, initialIngredients }: { initialProducts: Product[]; initialCategories: ProductCategoryDefinition[]; initialIngredients: ProductIngredientDefinition[] }) {
  const { csrfToken } = useAdminSession();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [managedIngredients, setManagedIngredients] = useState(initialIngredients);
  const [editing, setEditing] = useState<Product | null>(null);
  const [pending, setPending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryPending, setCategoryPending] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState("");
  const [selectCreatedCategory, setSelectCreatedCategory] = useState(false);
  const [ingredientOpen, setIngredientOpen] = useState(false);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientPending, setIngredientPending] = useState(false);
  const [ingredientMessage, setIngredientMessage] = useState("");
  const [selectCreatedIngredient, setSelectCreatedIngredient] = useState(false);

  function openForm(product?: Product) {
    const value = product ? structuredClone(product) : structuredClone(emptyProduct);
    setEditing(value);
    setOriginalImage(value.image);
    setUploadedImage("");
    setMessage("");
  }

  function openIngredientForm(selectAfterCreate = false) {
    setIngredientName("");
    setIngredientMessage("");
    setSelectCreatedIngredient(selectAfterCreate);
    setIngredientOpen(true);
  }

  async function saveIngredient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIngredientPending(true);
    setIngredientMessage("");
    const response = await fetch("/api/admin/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ name: ingredientName }),
    });
    const result = (await response.json()) as { ingredient?: ProductIngredientDefinition; message?: string };
    setIngredientPending(false);
    if (!response.ok || !result.ingredient) {
      setIngredientMessage(result.message ?? "Không thể tạo nguyên liệu.");
      return;
    }
    setManagedIngredients((current) => [...current, result.ingredient!].sort((left, right) => left.name.localeCompare(right.name, "vi")));
    if (selectCreatedIngredient) {
      setEditing((current) => current ? { ...current, ingredients: [...current.ingredients, result.ingredient!.name] } : current);
    }
    setIngredientOpen(false);
  }

  function toggleIngredient(name: string) {
    setEditing((current) => {
      if (!current) return current;
      const ingredients = current.ingredients.includes(name)
        ? current.ingredients.filter((ingredient) => ingredient !== name)
        : [...current.ingredients, name];
      return { ...current, ingredients };
    });
  }

  function openCategoryForm(selectAfterCreate = false) {
    setCategoryLabel("");
    setCategoryDescription("");
    setCategoryMessage("");
    setSelectCreatedCategory(selectAfterCreate);
    setCategoryOpen(true);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryPending(true);
    setCategoryMessage("");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ label: categoryLabel, description: categoryDescription }),
    });
    const result = (await response.json()) as { category?: ProductCategoryDefinition; message?: string };
    setCategoryPending(false);
    if (!response.ok || !result.category) {
      setCategoryMessage(result.message ?? "Không thể tạo danh mục.");
      return;
    }
    setCategories((current) => [...current, result.category!]);
    if (selectCreatedCategory) update("category", result.category.value);
    setCategoryOpen(false);
  }

  async function deleteManagedImage(url: string) {
    if (!url.startsWith("https://")) return;
    try {
      await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ url }) });
    } catch {
      // Cleanup is best-effort; never discard the user's saved form state.
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
    update("image", url);
    if (previousUpload && previousUpload !== url) await deleteManagedImage(previousUpload);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (editing.ingredients.length === 0) {
      setMessage("Hãy chọn ít nhất một nguyên liệu.");
      return;
    }
    setPending(true);
    setMessage("");
    const isNew = editing.id === 0;
    const product = editing;
    const response = await fetch("/api/admin/data", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "products", id: editing.id, data: product }) });
    const result = (await response.json()) as { item?: Product; message?: string };
    setPending(false);
    if (!response.ok || !result.item) { setMessage(result.message ?? "Không thể lưu sản phẩm."); return; }
    setProducts((current) => isNew ? [...current, result.item!] : current.map((item) => item.id === result.item!.id ? result.item! : item));
    if (originalImage && originalImage !== result.item.image) void deleteManagedImage(originalImage);
    setUploadedImage("");
    setEditing(null);
  }

  async function remove(product: Product) {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”? Thao tác này không thể hoàn tác.`)) return;
    const response = await fetch("/api/admin/data", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "products", id: product.id }) });
    if (response.ok) {
      setProducts((current) => current.filter((item) => item.id !== product.id));
      void deleteManagedImage(product.image);
    }
  }

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Danh mục</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Sản phẩm</h1><p className="mt-2 text-[14px] text-muted">{products.length} sản phẩm đang hiển thị trên website.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => openIngredientForm()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest px-4 text-[14px] font-semibold text-forest hover:bg-forest/10"><Wheat className="h-4 w-4" /> Thêm nguyên liệu</button><button type="button" onClick={() => openCategoryForm()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest px-4 text-[14px] font-semibold text-forest hover:bg-forest/10"><FolderPlus className="h-4 w-4" /> Thêm danh mục</button><button type="button" onClick={() => openForm()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-4 text-[14px] font-semibold text-white hover:bg-forest-hover"><Plus className="h-4 w-4" /> Thêm sản phẩm</button></div></header>
      {products.length === 0 ? <div className="rounded-[14px] bg-paper px-5 py-16 text-center text-muted">Chưa có sản phẩm.</div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <article key={product.id} className="flex gap-3 rounded-[14px] bg-paper p-3 sm:p-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-sand"><Image src={product.image} alt="" fill sizes="80px" className="object-cover" /></div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-[14px] font-semibold leading-5 text-ink">{product.name}</h2><p className="mt-1 text-[12px] text-muted">{getCategoryLabel(product.category, categories)} · {product.weight} · {formatPrice(product.price)}</p><div className="mt-2 flex gap-1"><button type="button" onClick={() => openForm(product)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[12px] font-semibold text-forest hover:bg-forest/10"><Pencil className="h-3.5 w-3.5" /> Sửa</button><button type="button" onClick={() => remove(product)} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-error/10 hover:text-error" aria-label={`Xóa ${product.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div>}

      {editing ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="product-form-title"><button type="button" onClick={closeForm} className="absolute inset-0" aria-label="Đóng biểu mẫu" /><form onSubmit={save} className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 id="product-form-title" className="text-xl font-semibold text-ink">{editing.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2><button type="button" onClick={closeForm} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-ink">Tên sản phẩm *<input required value={editing.name} onChange={(event) => update("name", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Tên ngắn *<input required value={editing.shortName} onChange={(event) => update("shortName", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <div><div className="flex items-center justify-between gap-2"><label htmlFor="product-category" className="text-[13px] font-semibold text-ink">Danh mục *</label><button type="button" onClick={() => openCategoryForm(true)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline"><Plus className="h-3.5 w-3.5" /> Thêm danh mục</button></div><select id="product-category" required value={editing.category} onChange={(event) => update("category", event.target.value as ProductCategory)} className={`${inputClass} mt-1.5`}>{categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></div>
        <label className="text-[13px] font-semibold text-ink">Slug *<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={editing.slug} onChange={(event) => update("slug", event.target.value)} className={`${inputClass} mt-1.5`} placeholder="ngu-coc-moi" /></label>
        <label className="text-[13px] font-semibold text-ink">Khối lượng *<input required value={editing.weight} onChange={(event) => update("weight", event.target.value)} className={`${inputClass} mt-1.5`} placeholder="500g" /></label>
        <label className="text-[13px] font-semibold text-ink">Giá bán *<input required type="number" inputMode="numeric" min={1000} step={1000} value={editing.price || ""} onChange={(event) => update("price", Number(event.target.value))} className={`${inputClass} mt-1.5`} /></label>
        <ImageUploadField value={editing.image} folder="products" disabled={pending} onUploaded={imageUploaded} onBusyChange={setImageUploading} />
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Alt ảnh *<input required value={editing.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Mô tả *<textarea required rows={3} value={editing.description} onChange={(event) => update("description", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
        <div className="sm:col-span-2"><div className="flex items-center justify-between gap-2"><p className="text-[13px] font-semibold text-ink">Nguyên liệu *</p><button type="button" onClick={() => openIngredientForm(true)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline"><Plus className="h-3.5 w-3.5" /> Thêm nguyên liệu</button></div><div className="mt-1.5 flex min-h-14 flex-wrap gap-2 rounded-[10px] border border-border bg-cream p-2.5">{managedIngredients.length === 0 ? <p className="self-center px-1 text-[13px] text-muted">Chưa có nguyên liệu. Hãy tạo nguyên liệu mới.</p> : managedIngredients.map((ingredient) => { const selected = editing.ingredients.includes(ingredient.name); return <button key={ingredient.name} type="button" aria-pressed={selected} onClick={() => toggleIngredient(ingredient.name)} className={`rounded-full border px-3 py-2 text-[13px] font-medium transition-colors ${selected ? "border-forest bg-forest text-white" : "border-border bg-paper text-body hover:border-sage"}`}>{ingredient.name}</button>; })}</div><p className="mt-1.5 text-[11px] text-muted">Có thể chọn nhiều nguyên liệu cho một sản phẩm.</p></div>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Cách dùng *<textarea required rows={3} value={editing.usage} onChange={(event) => update("usage", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Bảo quản *<textarea required rows={2} value={editing.storage} onChange={(event) => update("storage", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
      </div>{message ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{message}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={closeForm} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand">Hủy</button><button type="submit" disabled={pending || imageUploading} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu sản phẩm</button></div></form></div> : null}

      {categoryOpen ? <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="category-form-title"><button type="button" onClick={() => !categoryPending && setCategoryOpen(false)} className="absolute inset-0" aria-label="Đóng biểu mẫu danh mục" /><form onSubmit={saveCategory} className="relative w-full max-w-lg rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><div><h2 id="category-form-title" className="text-xl font-semibold text-ink">Thêm danh mục</h2><p className="mt-1 text-[13px] text-muted">Danh mục mới sẽ dùng được ngay cho sản phẩm.</p></div><button type="button" disabled={categoryPending} onClick={() => setCategoryOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand disabled:opacity-50" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="space-y-4"><label className="block text-[13px] font-semibold text-ink">Tên danh mục *<input autoFocus required minLength={2} maxLength={100} value={categoryLabel} onChange={(event) => setCategoryLabel(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="Ví dụ: Dành cho trẻ nhỏ" /></label><label className="block text-[13px] font-semibold text-ink">Mô tả *<textarea required minLength={10} maxLength={500} rows={4} value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} placeholder="Mô tả ngắn về nhóm sản phẩm này" /></label></div>{categoryMessage ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{categoryMessage}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" disabled={categoryPending} onClick={() => setCategoryOpen(false)} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand disabled:opacity-50">Hủy</button><button type="submit" disabled={categoryPending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{categoryPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />} Tạo danh mục</button></div></form></div> : null}

      {ingredientOpen ? <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="ingredient-form-title"><button type="button" onClick={() => !ingredientPending && setIngredientOpen(false)} className="absolute inset-0" aria-label="Đóng biểu mẫu nguyên liệu" /><form onSubmit={saveIngredient} className="relative w-full max-w-lg rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><div><h2 id="ingredient-form-title" className="text-xl font-semibold text-ink">Thêm nguyên liệu</h2><p className="mt-1 text-[13px] text-muted">Nguyên liệu mới sẽ dùng được ngay trong form sản phẩm.</p></div><button type="button" disabled={ingredientPending} onClick={() => setIngredientOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand disabled:opacity-50" aria-label="Đóng"><X className="h-5 w-5" /></button></div><label className="block text-[13px] font-semibold text-ink">Tên nguyên liệu *<input autoFocus required minLength={2} maxLength={100} value={ingredientName} onChange={(event) => setIngredientName(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="Ví dụ: Hạt chia" /></label>{ingredientMessage ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{ingredientMessage}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" disabled={ingredientPending} onClick={() => setIngredientOpen(false)} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand disabled:opacity-50">Hủy</button><button type="submit" disabled={ingredientPending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{ingredientPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wheat className="h-4 w-4" />} Tạo nguyên liệu</button></div></form></div> : null}
    </div>
  );
}
