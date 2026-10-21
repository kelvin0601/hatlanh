import "server-only";

import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import type { Product } from "@/lib/products";
import type { Article } from "@/lib/articles";
import type { Order, OrderItem } from "@/lib/commerce";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import type { AdminPermission } from "@/lib/admin-permissions";

export interface StoreData {
  products: Product[];
  articles: Article[];
  orders: Order[];
  updatedAt: string;
}

function toProduct(row: typeof schema.products.$inferSelect): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    weight: row.weight,
    price: row.price,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
    ingredients: row.ingredients,
    usage: row.usage,
    storage: row.storage,
  };
}

function toArticle(row: typeof schema.articles.$inferSelect): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    image: row.image,
    imageAlt: row.imageAlt,
    content: row.content,
  };
}

function toOrder(
  row: typeof schema.orders.$inferSelect,
  items: (typeof schema.orderItems.$inferSelect)[],
): Order {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    customer: {
      name: row.customerName,
      phone: row.customerPhone,
      email: row.customerEmail,
      address: row.customerAddress,
      city: row.customerCity,
      note: row.customerNote,
    },
    paymentMethod: row.paymentMethod,
    paymentStatus: row.paymentStatus,
    status: row.status,
    items: items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      weight: item.weight,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: row.subtotal,
    shippingFee: row.shippingFee,
    total: row.total,
    emailStatus: row.emailStatus,
    idempotencyKey: row.idempotencyKey ?? undefined,
  };
}

async function queryAllOrders(): Promise<Order[]> {
  const orderRows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  if (orderRows.length === 0) return [];
  const itemRows = await db.select().from(schema.orderItems);
  const itemsByOrder = new Map<string, (typeof schema.orderItems.$inferSelect)[]>();
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }
  return orderRows.map((row) => toOrder(row, itemsByOrder.get(row.id) ?? []));
}

export async function readStore(): Promise<StoreData> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");

  const [productRows, articleRows, orders] = await Promise.all([
    db.select().from(schema.products).orderBy(schema.products.id),
    db.select().from(schema.articles).orderBy(desc(schema.articles.date)),
    queryAllOrders(),
  ]);

  return {
    products: productRows.map(toProduct),
    articles: articleRows.map(toArticle),
    orders,
    updatedAt: new Date().toISOString(),
  };
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

function invalidateStore() {
  revalidateTag("hat-lanh-store", { expire: 0 });
}

export async function getStoreProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  const rows = await db.select().from(schema.products).orderBy(schema.products.id);
  return rows.map(toProduct);
}

export async function getStoreArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  const rows = await db.select().from(schema.articles).orderBy(desc(schema.articles.date));
  return rows.map(toArticle);
}

export async function getStoreProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  const rows = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1);
  return rows[0] ? toProduct(rows[0]) : undefined;
}

export async function getStoreArticleBySlug(slug: string): Promise<Article | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  const rows = await db.select().from(schema.articles).where(eq(schema.articles.slug, slug)).limit(1);
  return rows[0] ? toArticle(rows[0]) : undefined;
}

export async function findOrderForCustomer(orderId: string, phone: string): Promise<Order | undefined> {
  const normalizedPhone = phone.replace(/\D/g, "");
  const orderRows = await db
    .select()
    .from(schema.orders)
    .where(eq(sql`upper(${schema.orders.id})`, orderId.toUpperCase()))
    .limit(1);

  const orderRow = orderRows[0];
  if (!orderRow) return undefined;
  if (orderRow.customerPhone.replace(/\D/g, "") !== normalizedPhone) return undefined;

  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderRow.id));
  return toOrder(orderRow, items);
}

export async function reserveOrder(order: Order, idempotencyKey: string): Promise<{ order: Order; created: boolean }> {
  const existingRows = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.idempotencyKey, idempotencyKey))
    .limit(1);

  if (existingRows.length > 0) {
    const existing = existingRows[0];
    if (
      existing.customerEmail !== order.customer.email ||
      existing.customerPhone !== order.customer.phone ||
      existing.total !== order.total
    ) {
      throw new Error("IDEMPOTENCY_CONFLICT");
    }
    const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, existing.id));
    return { order: toOrder(existing, items), created: false };
  }

  await db.insert(schema.orders).values({
    id: order.id,
    createdAt: new Date(order.createdAt),
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    customerEmail: order.customer.email,
    customerAddress: order.customer.address,
    customerCity: order.customer.city,
    customerNote: order.customer.note,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    emailStatus: order.emailStatus,
    idempotencyKey,
  });

  if (order.items.length > 0) {
    await db.insert(schema.orderItems).values(
      order.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        weight: item.weight,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    );
  }

  invalidateStore();
  return { order: { ...order, idempotencyKey }, created: true };
}

export async function updateOrderEmailStatus(orderId: string, emailStatus: Order["emailStatus"]) {
  await db.update(schema.orders).set({ emailStatus }).where(eq(schema.orders.id, orderId));
}

// --- Admin CRUD operations (used by admin data API) ---

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const rows = await db.insert(schema.products).values({
    slug: data.slug,
    name: data.name,
    shortName: data.shortName,
    weight: data.weight,
    price: data.price,
    description: data.description,
    image: data.image,
    imageAlt: data.imageAlt,
    ingredients: data.ingredients,
    usage: data.usage,
    storage: data.storage,
  }).returning();
  invalidateStore();
  return toProduct(rows[0]);
}

export async function updateProduct(id: number, data: Omit<Product, "id">): Promise<Product> {
  const rows = await db.update(schema.products).set({
    slug: data.slug,
    name: data.name,
    shortName: data.shortName,
    weight: data.weight,
    price: data.price,
    description: data.description,
    image: data.image,
    imageAlt: data.imageAlt,
    ingredients: data.ingredients,
    usage: data.usage,
    storage: data.storage,
    updatedAt: new Date(),
  }).where(eq(schema.products.id, id)).returning();
  if (rows.length === 0) throw new Error("Không tìm thấy sản phẩm.");
  invalidateStore();
  return toProduct(rows[0]);
}

export async function deleteProduct(id: number): Promise<string> {
  const rows = await db.delete(schema.products).where(eq(schema.products.id, id)).returning({ slug: schema.products.slug });
  if (rows.length === 0) throw new Error("Không tìm thấy sản phẩm.");
  invalidateStore();
  return rows[0].slug;
}

export async function createArticle(data: Article): Promise<Article> {
  const rows = await db.insert(schema.articles).values({
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    image: data.image,
    imageAlt: data.imageAlt,
    content: data.content,
  }).returning();
  invalidateStore();
  return toArticle(rows[0]);
}

export async function updateArticle(currentSlug: string, data: Article): Promise<Article> {
  const rows = await db.update(schema.articles).set({
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    image: data.image,
    imageAlt: data.imageAlt,
    content: data.content,
    updatedAt: new Date(),
  }).where(eq(schema.articles.slug, currentSlug)).returning();
  if (rows.length === 0) throw new Error("Không tìm thấy bài viết.");
  invalidateStore();
  return toArticle(rows[0]);
}

export async function deleteArticle(slug: string): Promise<string> {
  const rows = await db.delete(schema.articles).where(eq(schema.articles.slug, slug)).returning({ slug: schema.articles.slug });
  if (rows.length === 0) throw new Error("Không tìm thấy bài viết.");
  invalidateStore();
  return rows[0].slug;
}

export async function updateOrderStatus(
  orderId: string,
  data: { status?: string; paymentStatus?: string },
): Promise<Order> {
  const updates: Record<string, unknown> = {};
  if (data.status !== undefined) updates.status = data.status;
  if (data.paymentStatus !== undefined) updates.paymentStatus = data.paymentStatus;

  const rows = await db
    .update(schema.orders)
    .set(updates as Partial<typeof schema.orders.$inferInsert>)
    .where(eq(schema.orders.id, orderId))
    .returning();
  if (rows.length === 0) throw new Error("Không tìm thấy đơn hàng.");

  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId));
  invalidateStore();
  return toOrder(rows[0], items);
}

export async function productSlugExists(slug: string, excludeId?: number): Promise<boolean> {
  const condition = excludeId !== undefined
    ? and(eq(schema.products.slug, slug), sql`${schema.products.id} != ${excludeId}`)
    : eq(schema.products.slug, slug);
  const rows = await db.select({ id: schema.products.id }).from(schema.products).where(condition).limit(1);
  return rows.length > 0;
}

export async function articleSlugExists(slug: string, excludeSlug?: string): Promise<boolean> {
  const condition = excludeSlug
    ? and(eq(schema.articles.slug, slug), sql`${schema.articles.slug} != ${excludeSlug}`)
    : eq(schema.articles.slug, slug);
  const rows = await db.select({ id: schema.articles.id }).from(schema.articles).where(condition).limit(1);
  return rows.length > 0;
}
