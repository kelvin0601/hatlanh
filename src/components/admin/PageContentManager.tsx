"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ExternalLink, LoaderCircle, Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";
import { useAdminSession } from "@/components/admin/AdminShell";
import type { SiteContent, SitePageDefinition } from "@/lib/site-content";

const inputClass = "mt-1.5 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function PageContentManager({ definition, initialContent }: { definition: SitePageDefinition; initialContent: SiteContent }) {
  const { csrfToken } = useAdminSession();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const groups = useMemo(() => [...new Set(definition.fields.map((item) => item.group))], [definition.fields]);

  function update(key: string, value: string) {
    setContent((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ key: definition.key, content }),
    });
    const result = (await response.json()) as { content?: SiteContent; message?: string };
    setSaving(false);
    if (!response.ok || !result.content) {
      setMessage(result.message ?? "Không thể lưu nội dung trang.");
      return;
    }
    setContent(result.content);
    setMessage("Đã lưu nội dung trang.");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/noi-dung" className="mb-2 inline-flex items-center gap-1 text-[12px] font-semibold text-sage hover:text-forest"><ArrowLeft className="h-3.5 w-3.5" /> Nội dung trang</Link>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{definition.title}</h1>
          <p className="mt-1 text-[13px] text-muted">{definition.description}</p>
        </div>
        <Link href={definition.route} target="_blank" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-forest/20 bg-paper px-4 text-[13px] font-semibold text-forest hover:bg-forest/5">Xem trang <ExternalLink className="h-3.5 w-3.5" /></Link>
      </header>

      <form onSubmit={save} className="space-y-3">
        {groups.map((group) => (
          <section key={group} className="rounded-[14px] bg-paper p-4 sm:p-5">
            <h2 className="mb-4 text-[15px] font-semibold text-ink">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {definition.fields.filter((item) => item.group === group).map((item) => item.type === "gallery" ? (
                <GalleryUploadField key={item.key} value={content[item.key] ?? "[]"} label={item.label} disabled={saving} onBusyChange={setUploading} onChange={(value) => update(item.key, value)} />
              ) : item.type === "image" ? (
                <ImageUploadField key={item.key} value={content[item.key] ?? ""} folder="pages" label={item.label} required={false} disabled={saving} onBusyChange={setUploading} onUploaded={(url) => update(item.key, url)} />
              ) : (
                <label key={item.key} className={`text-[12px] font-semibold text-ink ${item.type === "textarea" ? "sm:col-span-2" : ""}`}>
                  {item.label}
                  {item.type === "textarea" ? <textarea rows={3} maxLength={5000} value={content[item.key] ?? ""} onChange={(event) => update(item.key, event.target.value)} className={`${inputClass} min-h-24 py-3 leading-5`} /> : <input type="text" maxLength={5000} value={content[item.key] ?? ""} onChange={(event) => update(item.key, event.target.value)} className={`${inputClass} h-11`} />}
                </label>
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-20 z-10 flex items-center justify-between gap-3 rounded-[14px] bg-ink px-4 py-3 text-white shadow-xl lg:bottom-4">
          <p className={`text-[12px] ${message.startsWith("Đã") ? "text-white/70" : "text-red-200"}`}>{message || "Thay đổi chỉ hiển thị sau khi bấm Lưu."}</p>
          <button type="submit" disabled={saving || uploading} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu</button>
        </div>
      </form>
    </div>
  );
}
