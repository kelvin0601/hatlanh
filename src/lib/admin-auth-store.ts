import "server-only";

import { createHash, createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { and, eq, gt, sql } from "drizzle-orm";
import type { AdminRole } from "@/lib/admin-permissions";
import { isAdminRole } from "@/lib/admin-permissions";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,39}$/;

export interface AdminUserDto {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

export function isAdminAuthConfigured() {
  return Boolean(getSecret());
}

function digestSecret(value: string) {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = createHash("sha256").update(left).digest();
  const rightBuffer = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftBuffer, rightBuffer);
}

async function derivePassword(password: string, salt: string, cost = 32_768) {
  const derived = await new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(password, salt, 64, { N: cost, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key));
  });
  return derived.toString("base64url");
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(18).toString("base64url");
  return `scrypt$32768$${salt}$${await derivePassword(password, salt)}`;
}

async function verifyPassword(password: string, encoded: string) {
  const parts = encoded.split("$");
  const algorithm = parts[0];
  const legacy = parts.length === 3;
  const cost = legacy ? 16_384 : Number(parts[1]);
  const salt = legacy ? parts[1] : parts[2];
  const expected = legacy ? parts[2] : parts[3];
  if (algorithm !== "scrypt" || !salt || !expected || ![16_384, 32_768].includes(cost)) {
    await derivePassword(password || "invalid", "an-vi-invalid-password");
    return false;
  }
  return safeEqual(await derivePassword(password, salt, cost), expected);
}

export function isStrongAdminPassword(password: string) {
  return password.length >= 12 && password.length <= 128 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function toDto(user: typeof schema.adminUsers.$inferSelect): AdminUserDto {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString(),
  };
}

export async function loginAdmin(usernameInput: string, password: string) {
  const username = usernameInput.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(username) || !password || password.length > 128 || !getSecret()) {
    await derivePassword(password || "invalid", "an-vi-invalid-password");
    return null;
  }

  let userRows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.username, username)).limit(1);
  let user = userRows[0];

  if (!user) {
    const allUsers = await db.select({ id: schema.adminUsers.id }).from(schema.adminUsers).limit(1);
    if (allUsers.length === 0) {
      const bootstrapUsername = (process.env.ADMIN_BOOTSTRAP_USERNAME ?? "owner").trim().toLowerCase();
      const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
      if (username === bootstrapUsername && safeEqual(password, bootstrapPassword) && isStrongAdminPassword(password)) {
        const now = new Date();
        const inserted = await db.insert(schema.adminUsers).values({
          username,
          name: "Chủ cửa hàng",
          role: "owner",
          passwordHash: await hashAdminPassword(password),
          active: true,
          createdAt: now,
          updatedAt: now,
        }).returning();
        user = inserted[0];
      }
    }
  }

  if (!user) {
    await derivePassword(password, "an-vi-invalid-password");
    return null;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!user.active || !passwordValid) return null;

  if (user.passwordHash.split("$").length === 3) {
    await db.update(schema.adminUsers).set({ passwordHash: await hashAdminPassword(password) }).where(eq(schema.adminUsers.id, user.id));
  }

  const rawToken = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  await db.update(schema.adminUsers).set({
    lastLoginAt: now,
    updatedAt: now,
  }).where(eq(schema.adminUsers.id, user.id));

  await db.delete(schema.adminSessions).where(eq(schema.adminSessions.userId, user.id));

  await db.insert(schema.adminSessions).values({
    tokenHash: digestSecret(rawToken),
    userId: user.id,
    createdAt: now,
    expiresAt,
  });

  user.lastLoginAt = now;
  return { token: rawToken, expiresAt, user: toDto(user) };
}

export async function findAdminSession(rawToken: string) {
  if (!rawToken || !getSecret()) return null;
  const tokenHash = digestSecret(rawToken);

  const sessionRows = await db
    .select()
    .from(schema.adminSessions)
    .where(and(
      eq(schema.adminSessions.tokenHash, tokenHash),
      gt(schema.adminSessions.expiresAt, new Date()),
    ))
    .limit(1);

  const session = sessionRows[0];
  if (!session) return null;

  const userRows = await db
    .select()
    .from(schema.adminUsers)
    .where(and(
      eq(schema.adminUsers.id, session.userId),
      eq(schema.adminUsers.active, true),
    ))
    .limit(1);

  const user = userRows[0];
  if (!user || !isAdminRole(user.role)) return null;

  return {
    user: toDto(user),
    csrfToken: digestSecret(`csrf:${rawToken}`),
    expiresAt: session.expiresAt.toISOString(),
  };
}

export async function logoutAdmin(rawToken: string) {
  if (!rawToken) return;
  const tokenHash = digestSecret(rawToken);
  await db.delete(schema.adminSessions).where(eq(schema.adminSessions.tokenHash, tokenHash));
}

export async function listAdminUsers(): Promise<AdminUserDto[]> {
  const rows = await db.select().from(schema.adminUsers);
  return rows.map(toDto);
}

export async function createAdminUser(input: { username: string; name: string; role: AdminRole; password: string }): Promise<AdminUserDto> {
  const username = input.username.trim().toLowerCase();
  const name = input.name.trim();
  if (!USERNAME_PATTERN.test(username) || name.length < 2 || name.length > 80 || !isAdminRole(input.role) || !isStrongAdminPassword(input.password)) {
    throw new Error("Thông tin nhân sự hoặc mật khẩu chưa đạt yêu cầu.");
  }

  const existing = await db.select({ id: schema.adminUsers.id }).from(schema.adminUsers).where(eq(schema.adminUsers.username, username)).limit(1);
  if (existing.length > 0) throw new Error("Tên đăng nhập đã tồn tại.");

  const now = new Date();
  const rows = await db.insert(schema.adminUsers).values({
    username,
    name,
    role: input.role,
    passwordHash: await hashAdminPassword(input.password),
    active: true,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return toDto(rows[0]);
}

export async function updateAdminUser(id: string, input: { name?: string; role?: AdminRole; active?: boolean; password?: string }, actorId: string): Promise<AdminUserDto> {
  const userRows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  const user = userRows[0];
  if (!user) throw new Error("Không tìm thấy nhân sự.");

  const nextRole = input.role ?? user.role;
  const nextActive = input.active ?? user.active;
  if (!isAdminRole(nextRole)) throw new Error("Vai trò không hợp lệ.");
  if (id === actorId && (!nextActive || nextRole !== "owner")) throw new Error("Bạn không thể tự khóa hoặc hạ quyền tài khoản owner đang dùng.");

  const otherOwners = await db
    .select({ id: schema.adminUsers.id })
    .from(schema.adminUsers)
    .where(and(
      sql`${schema.adminUsers.id} != ${id}`,
      eq(schema.adminUsers.active, true),
      eq(schema.adminUsers.role, "owner"),
    ));
  const activeOwners = otherOwners.length + (nextActive && nextRole === "owner" ? 1 : 0);
  if (activeOwners === 0) throw new Error("Hệ thống phải còn ít nhất một owner hoạt động.");

  const updates: Partial<typeof schema.adminUsers.$inferInsert> = {
    role: nextRole,
    active: nextActive,
    updatedAt: new Date(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (name.length < 2 || name.length > 80) throw new Error("Tên hiển thị không hợp lệ.");
    updates.name = name;
  }

  if (input.password !== undefined) {
    if (!isStrongAdminPassword(input.password)) throw new Error("Mật khẩu cần ít nhất 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
    updates.passwordHash = await hashAdminPassword(input.password);
  }

  const rows = await db.update(schema.adminUsers).set(updates).where(eq(schema.adminUsers.id, id)).returning();

  if (input.password !== undefined || input.role !== undefined || input.active !== undefined) {
    if (id !== actorId) {
      await db.delete(schema.adminSessions).where(eq(schema.adminSessions.userId, id));
    }
  }

  return toDto(rows[0]);
}
