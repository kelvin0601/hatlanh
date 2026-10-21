import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authorizeAdminRequest, getAdminCookieName, isAdminConfigured } from "@/lib/admin-auth";
import { loginAdmin, logoutAdmin } from "@/lib/admin-auth-store";
import { anonymizeRateLimitKey, getClientAddress, noStoreJson, takeRateLimit, verifyJsonRequest, verifySameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return noStoreJson({ message: "Admin chưa được cấu hình an toàn trên server." }, { status: 503 });
  }

  const requestCheck = verifyJsonRequest(request, 8_192);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  if (!verifySameOrigin(request)) return noStoreJson({ message: "Nguồn đăng nhập không hợp lệ." }, { status: 403 });

  let username = "";
  let password = "";
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    username = typeof body.username === "string" ? body.username : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return noStoreJson({ message: "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }

  const rateKey = anonymizeRateLimitKey(`admin-login:${getClientAddress(request)}:${username.trim().toLowerCase()}`);
  const rateLimit = takeRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return noStoreJson({ message: "Đăng nhập quá nhiều lần. Vui lòng thử lại sau." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
  }

  const session = await loginAdmin(username, password);
  if (!session) return noStoreJson({ message: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });

  const response = NextResponse.json({ ok: true, user: session.user }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  response.cookies.set(getAdminCookieName(), session.token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
  });
  return response;
}

export async function DELETE(request: Request) {
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;
  const cookieName = getAdminCookieName();
  const rawToken = (await cookies()).get(cookieName)?.value ?? "";
  await logoutAdmin(rawToken);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
