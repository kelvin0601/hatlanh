"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { FileText, LayoutDashboard, Leaf, LogOut, Package, ShoppingCart, Users } from "lucide-react";
import clsx from "clsx";
import type { AdminUserDto } from "@/lib/admin-auth-store";
import type { AdminPermission } from "@/lib/admin-permissions";
import { ADMIN_ROLE_LABELS, hasPermission } from "@/lib/admin-permissions";

const navigation = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Package, permission: "catalog:write" as AdminPermission },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingCart, permission: "orders:read" as AdminPermission },
  { href: "/admin/bai-viet", label: "Bài viết", icon: FileText, permission: "content:write" as AdminPermission },
  { href: "/admin/nhan-su", label: "Nhân sự", icon: Users, permission: "staff:manage" as AdminPermission },
];

interface AdminClientSession {
  user: AdminUserDto;
  csrfToken: string;
}

const AdminSessionContext = createContext<AdminClientSession | null>(null);

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) throw new Error("Admin session is unavailable");
  return context;
}

export function AdminShell({ children, user, csrfToken }: { children: React.ReactNode; user: AdminUserDto; csrfToken: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const allowedNavigation = navigation.filter((item) => !item.permission || hasPermission(user.role, item.permission));

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE", headers: { "X-CSRF-Token": csrfToken } });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <AdminSessionContext.Provider value={{ user, csrfToken }}>
    <div className="admin-root min-h-dvh bg-[#f3f1eb] text-body">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink px-4 py-5 text-white lg:flex">
        <Link href="/admin" className="mb-8 flex min-h-12 items-center gap-3 px-3">
          <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-white/10"><Leaf className="h-5 w-5" /></span>
          <div><p className="font-semibold tracking-wide">Hạt Lành</p><p className="text-[11px] text-white/55">Trang quản trị</p></div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Điều hướng quản trị">
          {allowedNavigation.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={clsx("flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-[14px] font-medium transition-colors", active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}><Icon className="h-4.5 w-4.5" />{label}</Link>;
          })}
        </nav>
        <div className="mb-3 border-t border-white/10 px-3 pt-4"><p className="truncate text-[13px] font-semibold">{user.name}</p><p className="mt-0.5 text-[11px] text-white/55">{ADMIN_ROLE_LABELS[user.role]}</p></div>
        <button type="button" onClick={logout} className="flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-left text-[14px] text-white/65 hover:bg-white/10 hover:text-white"><LogOut className="h-4.5 w-4.5" />Đăng xuất</button>
      </aside>

      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-border bg-paper/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-ink"><Leaf className="h-5 w-5 text-forest" /> Hạt Lành Admin</Link>
        <button type="button" onClick={logout} className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-sand" aria-label="Đăng xuất"><LogOut className="h-5 w-5" /></button>
      </header>

      <main className="min-h-dvh px-4 pb-28 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-9">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-paper px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(33,55,40,0.08)] lg:hidden" aria-label="Điều hướng quản trị mobile">
        {allowedNavigation.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={clsx("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-forest" : "text-muted")}><Icon className="h-5 w-5" /><span>{label}</span></Link>;
        })}
      </nav>
    </div>
    </AdminSessionContext.Provider>
  );
}
