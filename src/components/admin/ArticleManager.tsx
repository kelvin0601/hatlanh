"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Article } from "@/lib/articles";
import { useAdminSession } from "@/components/admin/AdminShell";

const emptyArticle: Article = { slug: "", title: "", excerpt: "", category: "Dinh dưỡng", date: new Date().toISOString().slice(0, 10), image: "/images/07_blog/story.jpg", imageAlt: "", content: "" };
const inputClass = "h-11 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function ArticleManager({ initialArticles }: { initialArticles: Article[] }) {
  const { csrfToken } = useAdminSession();
  const [articles, setArticles] = useState(initialArticles);
  const [editing, setEditing] = useState<Article | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function openForm(article?: Article) {
    const value = article ? structuredClone(article) : structuredClone(emptyArticle);
    setEditing(value);
    setOriginalSlug(article?.slug ?? "");
    setMessage("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    setMessage("");
    const isNew = !originalSlug;
    const response = await fetch("/api/admin/data", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "articles", id: originalSlug, data: editing }) });
    const result = (await response.json()) as { item?: Article; message?: string };
    setPending(false);
    if (!response.ok || !result.item) { setMessage(result.message ?? "Không thể lưu bài viết."); return; }
    setArticles((current) => isNew ? [result.item!, ...current] : current.map((item) => item.slug === originalSlug ? result.item! : item));
    setEditing(null);
  }

  async function remove(article: Article) {
    if (!window.confirm(`Xóa bài viết “${article.title}”? Thao tác này không thể hoàn tác.`)) return;
    const response = await fetch("/api/admin/data", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "articles", id: article.slug }) });
    if (response.ok) setArticles((current) => current.filter((item) => item.slug !== article.slug));
  }

  function update<K extends keyof Article>(key: K, value: Article[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex items-end justify-between gap-3"><div><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Nội dung</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Bài viết</h1><p className="mt-2 text-[14px] text-muted">{articles.length} bài trong Góc sống lành.</p></div><button type="button" onClick={() => openForm()} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-4 text-[14px] font-semibold text-white hover:bg-forest-hover"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Thêm bài viết</span><span className="sm:hidden">Thêm</span></button></header>
      {articles.length === 0 ? <div className="rounded-[14px] bg-paper px-5 py-16 text-center text-muted">Chưa có bài viết.</div> : <div className="grid gap-3 lg:grid-cols-2">{articles.map((article) => <article key={article.slug} className="flex gap-3 rounded-[14px] bg-paper p-3 sm:p-4"><div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[10px] bg-sand sm:w-28"><Image src={article.image} alt="" fill sizes="112px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold uppercase tracking-wide text-sage">{article.category} · {new Intl.DateTimeFormat("vi-VN").format(new Date(article.date))}</p><h2 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-5 text-ink">{article.title}</h2><div className="mt-2 flex gap-1"><button type="button" onClick={() => openForm(article)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[12px] font-semibold text-forest hover:bg-forest/10"><Pencil className="h-3.5 w-3.5" /> Sửa</button><button type="button" onClick={() => remove(article)} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-error/10 hover:text-error" aria-label={`Xóa ${article.title}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div>}

      {editing ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="article-form-title"><button type="button" onClick={() => setEditing(null)} className="absolute inset-0" aria-label="Đóng biểu mẫu" /><form onSubmit={save} className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 id="article-form-title" className="text-xl font-semibold text-ink">{originalSlug ? "Sửa bài viết" : "Thêm bài viết"}</h2><button type="button" onClick={() => setEditing(null)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Tiêu đề *<input required minLength={5} value={editing.title} onChange={(event) => update("title", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Slug *<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={editing.slug} onChange={(event) => update("slug", event.target.value)} className={`${inputClass} mt-1.5`} placeholder="ten-bai-viet" /></label>
        <label className="text-[13px] font-semibold text-ink">Chuyên mục *<input required value={editing.category} onChange={(event) => update("category", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Ngày đăng *<input required type="date" value={editing.date} onChange={(event) => update("date", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink">Đường dẫn ảnh *<input required value={editing.image} onChange={(event) => update("image", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Alt ảnh *<input required value={editing.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Mô tả ngắn *<textarea required minLength={10} rows={3} value={editing.excerpt} onChange={(event) => update("excerpt", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3`} /></label>
        <label className="text-[13px] font-semibold text-ink sm:col-span-2">Nội dung *<textarea required minLength={20} rows={12} value={editing.content} onChange={(event) => update("content", event.target.value)} className={`${inputClass} mt-1.5 h-auto py-3 font-mono text-[13px] leading-6`} /><span className="mt-1 block text-[11px] font-normal text-muted">Dùng “##” cho tiêu đề phụ, “-” cho danh sách và “**chữ**” để in đậm.</span></label>
      </div>{message ? <p role="alert" className="mt-4 rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{message}</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand">Hủy</button><button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu bài viết</button></div></form></div> : null}
    </div>
  );
}
