import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { products as seedProducts, type Product } from "@/lib/products";
import { articles as seedArticles, type Article } from "@/lib/articles";
import type { Order } from "@/lib/commerce";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import type { AdminPermission } from "@/lib/admin-permissions";

export interface StoreData {
  products: Product[];
  articles: Article[];
  orders: Order[];
  updatedAt: string;
}

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIRECTORY, "store.json");
let mutationQueue = Promise.resolve();

function getSeedStore(): StoreData {
  return {
    products: structuredClone(seedProducts),
    articles: structuredClone(seedArticles),
    orders: [],
    updatedAt: new Date(0).toISOString(),
  };
}

function isStoreData(value: unknown): value is StoreData {
  if (typeof value !== "object" || value === null) return false;
  const store = value as Partial<StoreData>;
  return Array.isArray(store.products) && Array.isArray(store.articles) && Array.isArray(store.orders);
}

async function readStoreFromDisk(): Promise<StoreData> {
  try {
    const parsed = JSON.parse(await readFile(STORE_PATH, "utf8")) as unknown;
    return isStoreData(parsed) ? parsed : getSeedStore();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return getSeedStore();
    throw error;
  }
}

export async function readStore(): Promise<StoreData> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  return readStoreFromDisk();
}

export async function readAdminStore(permission: AdminPermission): Promise<StoreData> {
  await requireAdminSession(permission);
  return readStore();
}

export async function readAdminDashboardStore(): Promise<StoreData> {
  const session = await requireAdminSession();
  const store = await readStore();
  if (session.user.role === "editor") return { ...store, orders: [] };
  return store;
}

export async function mutateStore<T>(mutator: (store: StoreData) => T | Promise<T>): Promise<T> {
  let output!: T;
  let mutationError: unknown;

  mutationQueue = mutationQueue.then(async () => {
    try {
      const store = await readStoreFromDisk();
      output = await mutator(store);
      store.updatedAt = new Date().toISOString();
      await mkdir(DATA_DIRECTORY, { recursive: true });
      const temporaryPath = path.join(DATA_DIRECTORY, `store-${process.pid}.tmp`);
      await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
      await rename(temporaryPath, STORE_PATH);
    } catch (error) {
      mutationError = error;
    }
  });

  await mutationQueue;
  if (mutationError) throw mutationError;
  revalidateTag("hat-lanh-store", { expire: 0 });
  return output;
}

export async function getStoreProducts() {
  return (await readStore()).products;
}

export async function getStoreArticles() {
  return (await readStore()).articles;
}

export async function getStoreProductBySlug(slug: string) {
  return (await getStoreProducts()).find((product) => product.slug === slug);
}

export async function getStoreArticleBySlug(slug: string) {
  return (await getStoreArticles()).find((article) => article.slug === slug);
}

export async function addOrderToStore(order: Order) {
  await mutateStore((store) => {
    store.orders.unshift(order);
    store.orders = store.orders.slice(0, 1000);
  });
}

export async function reserveOrder(order: Order, idempotencyKey: string) {
  return mutateStore((store) => {
    const existing = store.orders.find((item) => item.idempotencyKey === idempotencyKey);
    if (existing) return { order: existing, created: false };
    const reserved = { ...order, idempotencyKey };
    store.orders.unshift(reserved);
    store.orders = store.orders.slice(0, 1000);
    return { order: reserved, created: true };
  });
}

export async function updateOrderEmailStatus(orderId: string, emailStatus: Order["emailStatus"]) {
  await mutateStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (order) order.emailStatus = emailStatus;
  });
}
