"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Leaf, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(result.message ?? "Không thể đăng nhập. Vui lòng thử lại.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="admin-root grid min-h-dvh place-items-center bg-cream px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white"><Leaf className="h-7 w-7" /></span>
          <h1 className="text-2xl font-semibold text-ink">Đăng nhập quản trị</h1>
          <p className="mt-2 text-[14px] text-muted">Quản lý sản phẩm, đơn hàng và nội dung An Vị.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label htmlFor="admin-username" className="block text-[14px] font-semibold text-ink">Tên đăng nhập</label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input id="admin-username" name="username" type="text" autoComplete="username" required minLength={3} maxLength={40} pattern="[a-zA-Z0-9._-]+" value={username} onChange={(event) => setUsername(event.target.value)} className="h-13 w-full rounded-[12px] border border-border bg-cream pl-11 pr-4 text-base text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" />
          </div>
          <label htmlFor="admin-password" className="block text-[14px] font-semibold text-ink">Mật khẩu</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-13 w-full rounded-[12px] border border-border bg-cream pl-11 pr-12 text-base text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {error ? <p role="alert" className="rounded-[10px] bg-error/10 px-3 py-2 text-[13px] text-error">{error}</p> : null}
          <button type="submit" disabled={pending} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest font-semibold text-white hover:bg-forest-hover disabled:cursor-wait disabled:opacity-70">{pending ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Đang đăng nhập…</> : "Đăng nhập"}</button>
        </form>
      </div>
    </div>
  );
}
