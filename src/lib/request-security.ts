import "server-only";

import { createHash } from "node:crypto";

type RateLimitEntry = { count: number; resetAt: number };
const buckets = new Map<string, RateLimitEntry>();

export function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function anonymizeRateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function takeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5_000) {
    for (const [bucketKey, entry] of buckets) {
      if (entry.resetAt <= now || buckets.size > 4_000) buckets.delete(bucketKey);
      if (buckets.size <= 4_000) break;
    }
  }
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function verifyJsonRequest(request: Request, maxBytes: number) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return { ok: false as const, status: 415, message: "Chỉ chấp nhận dữ liệu JSON." };
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > maxBytes) {
    return { ok: false as const, status: 413, message: "Dữ liệu gửi lên quá lớn." };
  }
  return { ok: true as const };
}

export function verifySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
    return Boolean(host && originUrl.host === host && originUrl.protocol === `${protocol}:`);
  } catch {
    return false;
  }
}

export function noStoreJson(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  return Response.json(data, { ...init, headers });
}
