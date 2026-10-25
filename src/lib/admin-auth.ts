import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { AdminPermission } from "@/lib/admin-permissions";
import { hasPermission } from "@/lib/admin-permissions";
import { findAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth-store";
import { noStoreJson, verifySameOrigin } from "@/lib/request-security";

const LOCAL_COOKIE_NAME = "an_vi_session";
const PRODUCTION_COOKIE_NAME = "__Host-an_vi_session";

export function getAdminCookieName() {
  return process.env.NODE_ENV === "production" ? PRODUCTION_COOKIE_NAME : LOCAL_COOKIE_NAME;
}

export { isAdminAuthConfigured as isAdminConfigured };

export async function getAdminSession() {
  await connection();
  const rawToken = (await cookies()).get(getAdminCookieName())?.value ?? "";
  return findAdminSession(rawToken);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminSession(permission?: AdminPermission) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (permission && !hasPermission(session.user.role, permission)) redirect("/admin");
  return session;
}

export async function authorizeAdminRequest(request: Request, permission?: AdminPermission, requireCsrf = false) {
  const session = await getAdminSession();
  if (!session) return { ok: false as const, response: noStoreJson({ message: "Phiên đăng nhập đã hết hạn." }, { status: 401 }) };
  if (permission && !hasPermission(session.user.role, permission)) return { ok: false as const, response: noStoreJson({ message: "Tài khoản không có quyền thực hiện thao tác này." }, { status: 403 }) };
  if (requireCsrf && (!verifySameOrigin(request) || request.headers.get("x-csrf-token") !== session.csrfToken)) {
    return { ok: false as const, response: noStoreJson({ message: "Yêu cầu bảo mật không hợp lệ. Hãy tải lại trang." }, { status: 403 }) };
  }
  return { ok: true as const, session };
}
