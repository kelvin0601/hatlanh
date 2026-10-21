import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <Suspense fallback={<div className="admin-root min-h-dvh bg-cream" />}><LoginContent /></Suspense>;
}

async function LoginContent() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return <AdminLoginForm />;
}
