"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, LoaderCircle, ShieldCheck, UserPlus, X } from "lucide-react";
import { useAdminSession } from "@/components/admin/AdminShell";
import type { AdminUserDto } from "@/lib/admin-auth-store";
import type { AdminRole } from "@/lib/admin-permissions";
import { ADMIN_ROLE_LABELS } from "@/lib/admin-permissions";

const roles = Object.entries(ADMIN_ROLE_LABELS) as [AdminRole, string][];
const inputClass = "h-11 w-full rounded-[10px] border border-border bg-cream px-3 text-[14px] text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

export function UserManager({ initialUsers }: { initialUsers: AdminUserDto[] }) {
  const { user: currentUser, csrfToken } = useAdminSession();
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ username: "", name: "", role: "editor" as AdminRole, password: "" });
  const [pending, setPending] = useState(false);
  const [resetting, setResetting] = useState<AdminUserDto | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetPending, setResetPending] = useState(false);
  const [message, setMessage] = useState("");

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify(form),
    });
    const result = (await response.json()) as { user?: AdminUserDto; message?: string };
    setPending(false);
    if (!response.ok || !result.user) return setMessage(result.message ?? "Không thể tạo tài khoản.");
    setUsers((current) => [...current, result.user!]);
    setForm({ username: "", name: "", role: "editor", password: "" });
    setMessage("Đã tạo tài khoản nhân sự.");
  }

  async function updateUser(id: string, data: { role?: AdminRole; active?: boolean; password?: string }) {
    setMessage("");
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ id, data }),
    });
    const result = (await response.json()) as { user?: AdminUserDto; message?: string };
    if (!response.ok || !result.user) {
      setMessage(result.message ?? "Không thể cập nhật tài khoản.");
      return false;
    }
    setUsers((current) => current.map((user) => user.id === id ? result.user! : user));
    setMessage("Đã cập nhật quyền truy cập.");
    return true;
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetting) return;
    setResetPending(true);
    const updated = await updateUser(resetting.id, { password: newPassword });
    setResetPending(false);
    if (updated) {
      setResetting(null);
      setNewPassword("");
      setMessage("Đã đặt lại mật khẩu và thu hồi các phiên cũ.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6"><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Phân quyền</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Nhân sự</h1><p className="mt-2 text-[14px] text-muted">Mỗi người dùng một tài khoản riêng; không chia sẻ mật khẩu owner.</p></header>
      {message ? <p aria-live="polite" className="mb-4 rounded-[10px] bg-paper px-4 py-3 text-[13px] text-forest">{message}</p> : null}

      <section className="mb-6 rounded-[14px] bg-paper p-4 sm:p-6" aria-labelledby="create-user-heading">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[11px] bg-forest/10 text-forest"><UserPlus className="h-5 w-5" /></span><div><h2 id="create-user-heading" className="font-semibold text-ink">Thêm tài khoản</h2><p className="text-[12px] text-muted">Cấp đúng quyền theo công việc.</p></div></div>
        <form onSubmit={createUser} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
          <label className="text-[13px] font-semibold text-ink">Tên hiển thị<input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} className={`${inputClass} mt-1.5`} /></label>
          <label className="text-[13px] font-semibold text-ink">Tên đăng nhập<input required minLength={3} maxLength={40} pattern="[a-zA-Z0-9._-]+" autoComplete="off" value={form.username} onChange={(event) => setForm((value) => ({ ...value, username: event.target.value }))} className={`${inputClass} mt-1.5`} /></label>
          <label className="text-[13px] font-semibold text-ink">Vai trò<select value={form.role} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value as AdminRole }))} className={`${inputClass} mt-1.5`}>{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-[13px] font-semibold text-ink">Mật khẩu tạm<input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={form.password} onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))} className={`${inputClass} mt-1.5`} /></label>
          <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Tạo tài khoản</button>
        </form>
        <p className="mt-3 text-[11px] leading-5 text-muted">Mật khẩu cần có ít nhất 12 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
      </section>

      <section className="overflow-hidden rounded-[14px] bg-paper" aria-label="Danh sách nhân sự">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_auto] gap-4 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted md:grid"><span>Nhân sự</span><span>Vai trò</span><span>Trạng thái</span><span>Thao tác</span></div>
        <div className="divide-y divide-border">{users.map((user) => <article key={user.id} className="grid gap-4 p-4 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center md:px-5">
          <div><div className="flex items-center gap-2"><p className="font-semibold text-ink">{user.name}</p>{user.id === currentUser.id ? <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest">Bạn</span> : null}</div><p className="mt-0.5 text-[12px] text-muted">@{user.username}</p></div>
          <label><span className="sr-only">Vai trò của {user.name}</span><select value={user.role} disabled={user.id === currentUser.id} onChange={(event) => updateUser(user.id, { role: event.target.value as AdminRole })} className="h-11 w-full rounded-full border border-border bg-cream px-3 text-[13px] font-semibold text-ink disabled:opacity-60">{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="inline-flex min-h-11 items-center gap-2 text-[13px] font-medium text-body"><input type="checkbox" checked={user.active} disabled={user.id === currentUser.id} onChange={(event) => updateUser(user.id, { active: event.target.checked })} className="h-5 w-5 accent-forest" /> {user.active ? "Đang hoạt động" : "Đã khóa"}</label>
          <button type="button" onClick={() => { setResetting(user); setNewPassword(""); setMessage(""); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold text-forest hover:bg-forest/10"><KeyRound className="h-4 w-4" /> Đặt lại mật khẩu</button>
        </article>)}</div>
      </section>

      <div className="mt-5 rounded-[12px] border border-forest/10 bg-forest/5 p-4 text-[12px] leading-5 text-body"><ShieldCheck className="mr-2 inline h-4 w-4 text-forest" />Thay đổi vai trò, khóa tài khoản hoặc đổi mật khẩu sẽ thu hồi các phiên đăng nhập liên quan.</div>

      {resetting ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="reset-password-title"><button type="button" onClick={() => setResetting(null)} className="absolute inset-0" aria-label="Đóng biểu mẫu" /><form onSubmit={resetPassword} className="relative w-full max-w-md rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="reset-password-title" className="text-xl font-semibold text-ink">Đặt lại mật khẩu</h2><p className="mt-1 text-[13px] text-muted">Tài khoản @{resetting.username} sẽ bị đăng xuất trên các thiết bị khác.</p></div><button type="button" onClick={() => setResetting(null)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-sand" aria-label="Đóng"><X className="h-5 w-5" /></button></div><label className="text-[13px] font-semibold text-ink">Mật khẩu mới<input autoFocus required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={`${inputClass} mt-1.5`} /></label><p className="mt-2 text-[11px] leading-5 text-muted">Ít nhất 12 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setResetting(null)} className="min-h-11 rounded-full px-5 text-[14px] font-semibold text-muted hover:bg-sand">Hủy</button><button type="submit" disabled={resetPending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-white disabled:opacity-60">{resetPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Cập nhật</button></div></form></div> : null}
    </div>
  );
}
