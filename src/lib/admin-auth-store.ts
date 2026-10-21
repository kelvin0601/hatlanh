import "server-only";

import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { AdminRole } from "@/lib/admin-permissions";
import { isAdminRole } from "@/lib/admin-permissions";

const scrypt = promisify(nodeScrypt);
const AUTH_PATH = path.join(process.cwd(), "data", "auth.json");
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,39}$/;
let authQueue = Promise.resolve();

interface AdminUserRecord {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface AdminSessionRecord {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

interface AuthStore {
  users: AdminUserRecord[];
  sessions: AdminSessionRecord[];
}

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
  return Boolean(getSecret() && (process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.ADMIN_PASSWORD));
}

function emptyStore(): AuthStore {
  return { users: [], sessions: [] };
}

function isAuthStore(value: unknown): value is AuthStore {
  if (!value || typeof value !== "object") return false;
  const store = value as Partial<AuthStore>;
  return Array.isArray(store.users) && Array.isArray(store.sessions);
}

async function readAuthStore(): Promise<AuthStore> {
  try {
    const parsed = JSON.parse(await readFile(AUTH_PATH, "utf8")) as unknown;
    return isAuthStore(parsed) ? parsed : emptyStore();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function mutateAuthStore<T>(mutator: (store: AuthStore) => T | Promise<T>): Promise<T> {
  let output!: T;
  let failure: unknown;
  authQueue = authQueue.then(async () => {
    try {
      const store = await readAuthStore();
      store.sessions = store.sessions.filter((session) => Date.parse(session.expiresAt) > Date.now());
      output = await mutator(store);
      await mkdir(path.dirname(AUTH_PATH), { recursive: true });
      const temporaryPath = `${AUTH_PATH}.${process.pid}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
      await rename(temporaryPath, AUTH_PATH);
    } catch (error) {
      failure = error;
    }
  });
  await authQueue;
  if (failure) throw failure;
  return output;
}

function digestSecret(value: string) {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function derivePassword(password: string, salt: string) {
  return Buffer.from(await scrypt(password, salt, 64)).toString("base64url");
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(18).toString("base64url");
  return `scrypt$${salt}$${await derivePassword(password, salt)}`;
}

async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, expected] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !expected) {
    await derivePassword(password || "invalid", "hat-lanh-invalid-password");
    return false;
  }
  return safeEqual(await derivePassword(password, salt), expected);
}

export function isStrongAdminPassword(password: string) {
  return password.length >= 12 && password.length <= 128 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function toDto(user: AdminUserRecord): AdminUserDto {
  return { id: user.id, username: user.username, name: user.name, role: user.role, active: user.active, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt };
}

export async function loginAdmin(usernameInput: string, password: string) {
  const username = usernameInput.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(username) || !password || !getSecret()) {
    await derivePassword(password || "invalid", "hat-lanh-invalid-password");
    return null;
  }

  return mutateAuthStore(async (store) => {
    let user = store.users.find((item) => item.username === username);
    if (!user && store.users.length === 0) {
      const bootstrapUsername = (process.env.ADMIN_BOOTSTRAP_USERNAME ?? "owner").trim().toLowerCase();
      const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
      if (username === bootstrapUsername && safeEqual(password, bootstrapPassword) && isStrongAdminPassword(password)) {
        const now = new Date().toISOString();
        user = { id: crypto.randomUUID(), username, name: "Chủ cửa hàng", role: "owner", passwordHash: await hashAdminPassword(password), active: true, createdAt: now, updatedAt: now };
        store.users.push(user);
      }
    }

    if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) return null;
    const rawToken = randomBytes(32).toString("base64url");
    const now = new Date();
    user.lastLoginAt = now.toISOString();
    user.updatedAt = now.toISOString();
    store.sessions = store.sessions.filter((session) => session.userId !== user.id).slice(-49);
    store.sessions.push({ tokenHash: digestSecret(rawToken), userId: user.id, createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString() });
    return { token: rawToken, expiresAt: new Date(now.getTime() + SESSION_TTL_MS), user: toDto(user) };
  });
}

export async function findAdminSession(rawToken: string) {
  if (!rawToken || !getSecret()) return null;
  const store = await readAuthStore();
  const tokenHash = digestSecret(rawToken);
  const session = store.sessions.find((item) => safeEqual(item.tokenHash, tokenHash) && Date.parse(item.expiresAt) > Date.now());
  if (!session) return null;
  const user = store.users.find((item) => item.id === session.userId && item.active && isAdminRole(item.role));
  if (!user) return null;
  return { user: toDto(user), csrfToken: digestSecret(`csrf:${rawToken}`), expiresAt: session.expiresAt };
}

export async function logoutAdmin(rawToken: string) {
  if (!rawToken) return;
  const tokenHash = digestSecret(rawToken);
  await mutateAuthStore((store) => {
    store.sessions = store.sessions.filter((session) => !safeEqual(session.tokenHash, tokenHash));
  });
}

export async function listAdminUsers() {
  return (await readAuthStore()).users.map(toDto);
}

export async function createAdminUser(input: { username: string; name: string; role: AdminRole; password: string }) {
  const username = input.username.trim().toLowerCase();
  const name = input.name.trim();
  if (!USERNAME_PATTERN.test(username) || name.length < 2 || name.length > 80 || !isAdminRole(input.role) || !isStrongAdminPassword(input.password)) throw new Error("Thông tin nhân sự hoặc mật khẩu chưa đạt yêu cầu.");
  return mutateAuthStore(async (store) => {
    if (store.users.some((user) => user.username === username)) throw new Error("Tên đăng nhập đã tồn tại.");
    const now = new Date().toISOString();
    const user: AdminUserRecord = { id: crypto.randomUUID(), username, name, role: input.role, passwordHash: await hashAdminPassword(input.password), active: true, createdAt: now, updatedAt: now };
    store.users.push(user);
    return toDto(user);
  });
}

export async function updateAdminUser(id: string, input: { name?: string; role?: AdminRole; active?: boolean; password?: string }, actorId: string) {
  return mutateAuthStore(async (store) => {
    const user = store.users.find((item) => item.id === id);
    if (!user) throw new Error("Không tìm thấy nhân sự.");
    const nextRole = input.role ?? user.role;
    const nextActive = input.active ?? user.active;
    if (!isAdminRole(nextRole)) throw new Error("Vai trò không hợp lệ.");
    if (id === actorId && (!nextActive || nextRole !== "owner")) throw new Error("Bạn không thể tự khóa hoặc hạ quyền tài khoản owner đang dùng.");
    const activeOwners = store.users.filter((item) => item.id !== id && item.active && item.role === "owner").length + (nextActive && nextRole === "owner" ? 1 : 0);
    if (activeOwners === 0) throw new Error("Hệ thống phải còn ít nhất một owner hoạt động.");
    if (input.name !== undefined) {
      const name = input.name.trim();
      if (name.length < 2 || name.length > 80) throw new Error("Tên hiển thị không hợp lệ.");
      user.name = name;
    }
    user.role = nextRole;
    user.active = nextActive;
    if (input.password !== undefined) {
      if (!isStrongAdminPassword(input.password)) throw new Error("Mật khẩu cần ít nhất 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      user.passwordHash = await hashAdminPassword(input.password);
    }
    user.updatedAt = new Date().toISOString();
    if (input.password !== undefined || input.role !== undefined || input.active !== undefined) {
      store.sessions = store.sessions.filter((session) => session.userId !== user.id || user.id === actorId);
    }
    return toDto(user);
  });
}
