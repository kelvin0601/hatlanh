import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin-auth";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };

export default function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="admin-root min-h-dvh bg-[#f3f1eb]" aria-label="Đang tải trang quản trị" />}><AuthenticatedAdmin>{children}</AuthenticatedAdmin></Suspense>;
}

async function AuthenticatedAdmin({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell user={session.user} csrfToken={session.csrfToken}>{children}</AdminShell>;
}
