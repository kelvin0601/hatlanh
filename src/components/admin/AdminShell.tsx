"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { ChevronRight, FilePenLine, FileText, FolderTree, LayoutDashboard, LogOut, Package, ShoppingCart, Users, Wheat } from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { AdminUserDto } from "@/lib/admin-auth-store";
import type { AdminPermission } from "@/lib/admin-permissions";
import { ADMIN_ROLE_LABELS, hasPermission } from "@/lib/admin-permissions";

const navigation = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Package, permission: "catalog:write" as AdminPermission },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingCart, permission: "orders:read" as AdminPermission },
  { href: "/admin/bai-viet", label: "Bài viết", icon: FileText, permission: "content:write" as AdminPermission },
  { href: "/admin/noi-dung", label: "Nội dung", icon: FilePenLine, permission: "content:write" as AdminPermission },
  { href: "/admin/nhan-su", label: "Nhân sự", icon: Users, permission: "staff:manage" as AdminPermission },
];

const productNavigation = [
  { href: "/admin/san-pham", label: "Sản phẩm", description: "Danh sách sản phẩm", icon: Package, exact: true },
  { href: "/admin/san-pham/danh-muc", label: "Danh mục", description: "Xem tất cả danh mục", icon: FolderTree },
  { href: "/admin/san-pham/nguyen-lieu", label: "Nguyên liệu", description: "Xem tất cả nguyên liệu", icon: Wheat },
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
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const allowedNavigation = navigation.filter((item) => !item.permission || hasPermission(user.role, item.permission));

  async function logout() {
    const response = await fetch("/api/admin/session", { method: "DELETE", headers: { "X-CSRF-Token": csrfToken } });
    if (!response.ok) return router.refresh();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <AdminSessionContext.Provider value={{ user, csrfToken }}>
      <div className="admin-root min-h-dvh bg-[#f3f1eb] text-body">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink px-4 py-5 text-white lg:flex">
          <Link href="/admin" className="mb-8 flex min-h-12 items-center gap-3 px-3">
            <span className="inline-flex rounded-[10px] bg-cream px-2 py-1"><BrandLogo className="h-8 w-auto" /></span>
            <span className="text-[11px] text-white/55">Quản trị</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1" aria-label="Điều hướng quản trị">
            {allowedNavigation.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              if (href === "/admin/san-pham") {
                return (
                  <div key={href} className="group/catalog relative">
                    <Link href={href} aria-haspopup="menu" className={clsx("flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-[14px] font-medium transition-colors", active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}><Icon className="h-4.5 w-4.5" />{label}<ChevronRight className="ml-auto h-4 w-4 opacity-60" /></Link>
                    <div className="invisible absolute left-full top-0 w-64 translate-x-1 pl-3 opacity-0 transition-[opacity,transform,visibility] duration-150 group-hover/catalog:visible group-hover/catalog:translate-x-0 group-hover/catalog:opacity-100 group-focus-within/catalog:visible group-focus-within/catalog:translate-x-0 group-focus-within/catalog:opacity-100">
                      <div className="rounded-[14px] bg-paper p-2 text-ink shadow-[0_16px_45px_rgba(20,38,27,0.22)] ring-1 ring-border/50" role="menu">
                        {productNavigation.map((item) => {
                          const subActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                          const SubIcon = item.icon;
                          return <Link key={item.href} href={item.href} role="menuitem" className={clsx("flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors", subActive ? "bg-forest text-white" : "hover:bg-sand")}><SubIcon className="h-4 w-4 shrink-0" /><span><span className="block text-[13px] font-semibold">{item.label}</span><span className={clsx("mt-0.5 block text-[11px]", subActive ? "text-white/65" : "text-muted")}>{item.description}</span></span></Link>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return <Link key={href} href={href} className={clsx("flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-[14px] font-medium transition-colors", active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}><Icon className="h-4.5 w-4.5" />{label}</Link>;
            })}
          </nav>
          <div className="mb-3 border-t border-white/10 px-3 pt-4"><p className="truncate text-[13px] font-semibold">{user.name}</p><p className="mt-0.5 text-[11px] text-white/55">{ADMIN_ROLE_LABELS[user.role]}</p></div>
          <button type="button" onClick={logout} className="flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-left text-[14px] text-white/65 hover:bg-white/10 hover:text-white"><LogOut className="h-4.5 w-4.5" />Đăng xuất</button>
        </aside>

        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-border bg-paper/95 px-4 backdrop-blur lg:hidden">
          <Link href="/admin" aria-label="An Vị Admin" className="flex items-center gap-2"><BrandLogo className="h-8 w-auto" /><span className="text-xs font-semibold text-muted">Admin</span></Link>
          <button type="button" onClick={logout} className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-sand" aria-label="Đăng xuất"><LogOut className="h-5 w-5" /></button>
        </header>

        <main className="min-h-dvh px-4 pb-28 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-9">{children}</main>

        {mobileCatalogOpen ? <><button type="button" onClick={() => setMobileCatalogOpen(false)} className="fixed inset-0 z-[35] bg-ink/25 lg:hidden" aria-label="Đóng menu sản phẩm" /><div className="fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-50 rounded-[16px] bg-paper p-2 shadow-[0_16px_45px_rgba(20,38,27,0.24)] ring-1 ring-border lg:hidden" role="menu">{productNavigation.map((item) => { const active = item.exact ? pathname === item.href : pathname.startsWith(item.href); const Icon = item.icon; return <Link key={item.href} href={item.href} role="menuitem" onClick={() => setMobileCatalogOpen(false)} className={clsx("flex min-h-14 items-center gap-3 rounded-[11px] px-3", active ? "bg-forest text-white" : "text-ink hover:bg-sand")}><Icon className="h-5 w-5" /><span><span className="block text-[14px] font-semibold">{item.label}</span><span className={clsx("block text-[11px]", active ? "text-white/65" : "text-muted")}>{item.description}</span></span></Link>; })}</div></> : null}

        <nav className="fixed inset-x-0 bottom-0 z-40 grid border-t border-border bg-paper px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(33,55,40,0.08)] lg:hidden" style={{ gridTemplateColumns: `repeat(${allowedNavigation.length}, minmax(0, 1fr))` }} aria-label="Điều hướng quản trị mobile">
          {allowedNavigation.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            if (href === "/admin/san-pham") {
              return <button key={href} type="button" onClick={() => setMobileCatalogOpen((current) => !current)} aria-expanded={mobileCatalogOpen} aria-haspopup="menu" className={clsx("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-forest" : "text-muted")}><Icon className="h-5 w-5" /><span>{label}</span></button>;
            }
            return <Link key={href} href={href} onClick={() => setMobileCatalogOpen(false)} className={clsx("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-forest" : "text-muted")}><Icon className="h-5 w-5" /><span>{label}</span></Link>;
          })}
        </nav>
      </div>
    </AdminSessionContext.Provider>
  );
}
