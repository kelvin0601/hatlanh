"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Chưa thể gửi lời nhắn.");
      setFeedback({ type: "success", message: result.message ?? "An Vị đã nhận lời nhắn của bạn." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Đã có lỗi xảy ra." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "h-[52px] rounded-[12px] border border-border bg-cream px-4 text-base text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20";
  return (
    <form className="flex flex-col gap-5 rounded-2xl bg-paper p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Họ và tên<input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></label>
        <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Email<input type="email" required maxLength={120} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
      </div>
      <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Số điện thoại<input type="tel" maxLength={20} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} /></label>
      <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Lời nhắn<textarea required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="resize-none rounded-[12px] border border-border bg-cream px-4 py-3 text-base leading-[1.65] text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" /></label>
      {feedback ? <div role="status" className={`flex items-start gap-2 rounded-[12px] border px-4 py-3 text-[14px] ${feedback.type === "success" ? "border-forest/20 bg-forest/5 text-forest" : "border-error/20 bg-error/10 text-error"}`}>{feedback.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}{feedback.message}</div> : null}
      <button type="submit" disabled={submitting} className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest px-7 text-base font-semibold text-white transition-colors hover:bg-forest-hover disabled:cursor-wait disabled:opacity-70 sm:w-fit">{submitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Đang gửi…</> : <>Gửi lời nhắn <Send className="h-4 w-4" /></>}</button>
    </form>
  );
}
