import "server-only";

import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { DEFAULT_PRODUCT_CATEGORY, isProductCategory, type Product, type ProductCategoryDefinition, type ProductComboItem } from "@/lib/products";
import type { Article } from "@/lib/articles";
import type { Order } from "@/lib/commerce";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import type { AdminPermission } from "@/lib/admin-permissions";
import type { ProductIngredientDefinition } from "@/lib/product-ingredients";

export interface StoreData {
  products: Product[];
  articles: Article[];
  orders: Order[];
  updatedAt: string;
}

function toProduct(row: typeof schema.products.$inferSelect, comboItems: ProductComboItem[] = []): Product {
  return {
    id: row.id,
    type: row.productType,
    comboItems,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    category: isProductCategory(row.category) ? row.category : DEFAULT_PRODUCT_CATEGORY,
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

async function queryProducts(): Promise<Product[]> {
  const [productRows, comboRows] = await Promise.all([
    db.select().from(schema.products).orderBy(schema.products.id),
    db.select().from(schema.productComboItems).orderBy(schema.productComboItems.id),
  ]);
  const comboItemsByProduct = new Map<number, ProductComboItem[]>();
  for (const row of comboRows) {
    const items = comboItemsByProduct.get(row.comboProductId) ?? [];
    items.push({ productId: row.productId, quantity: row.quantity });
    comboItemsByProduct.set(row.comboProductId, items);
  }
  return productRows.map((row) => toProduct(row, comboItemsByProduct.get(row.id) ?? []));
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
  cacheTag("an-vi-store");

  const [products, articleRows, orders] = await Promise.all([
    queryProducts(),
    db.select().from(schema.articles).orderBy(desc(schema.articles.date)),
    queryAllOrders(),
  ]);

  return {
    products,
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
  revalidateTag("an-vi-store", { expire: 0 });
}

export async function getStoreProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
  return queryProducts();
}

export async function getProductCategories(): Promise<ProductCategoryDefinition[]> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
  const rows = await db.select().from(schema.productCategories).orderBy(schema.productCategories.createdAt);
  return rows.map(toProductCategory);
}

export async function getStoreProductCategory(value: string): Promise<ProductCategoryDefinition | undefined> {
  const categories = await getProductCategories();
  return categories.find((category) => category.value === value);
}

export async function getProductIngredients(): Promise<ProductIngredientDefinition[]> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
  const rows = await db.select().from(schema.productIngredients).orderBy(schema.productIngredients.name);
  return rows.map(toProductIngredient);
}

export async function getStoreArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
  const rows = await db.select().from(schema.articles).orderBy(desc(schema.articles.date));
  return rows.map(toArticle);
}

export async function getStoreProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
  const products = await getStoreProducts();
  return products.find((product) => product.slug === slug);
}

export async function getStoreArticleBySlug(slug: string): Promise<Article | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-store");
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

export async function productCategoryExists(value: string): Promise<boolean> {
  const rows = await db.select({ value: schema.productCategories.value }).from(schema.productCategories).where(eq(schema.productCategories.value, value)).limit(1);
  return rows.length > 0;
}

export async function createProductCategory(data: ProductCategoryDefinition): Promise<ProductCategoryDefinition> {
  const existing = await db
    .select({ value: schema.productCategories.value })
    .from(schema.productCategories)
    .where(sql`${schema.productCategories.value} = ${data.value} OR lower(${schema.productCategories.label}) = lower(${data.label})`)
    .limit(1);
  if (existing.length > 0) throw new Error("Danh mục đã tồn tại.");
  const rows = await db.insert(schema.productCategories).values(data).returning();
  invalidateStore();
  return toProductCategory(rows[0]);
}

export async function updateProductCategory(value: string, data: Omit<ProductCategoryDefinition, "value">): Promise<ProductCategoryDefinition> {
  const duplicate = await db.select({ value: schema.productCategories.value }).from(schema.productCategories).where(sql`${schema.productCategories.value} != ${value} AND lower(${schema.productCategories.label}) = lower(${data.label})`).limit(1);
  if (duplicate.length > 0) throw new Error("Tên danh mục đã tồn tại.");
  const rows = await db.update(schema.productCategories).set({ label: data.label, description: data.description, image: data.image || null, imageAlt: data.imageAlt || null }).where(eq(schema.productCategories.value, value)).returning();
  if (rows.length === 0) throw new Error("Không tìm thấy danh mục.");
  invalidateStore();
  return toProductCategory(rows[0]);
}

export async function deleteProductCategory(value: string): Promise<ProductCategoryDefinition> {
  const used = await db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.category, value)).limit(1);
  if (used.length > 0) throw new Error("Danh mục đang được sản phẩm sử dụng nên chưa thể xóa.");
  const rows = await db.delete(schema.productCategories).where(eq(schema.productCategories.value, value)).returning();
  if (rows.length === 0) throw new Error("Không tìm thấy danh mục.");
  invalidateStore();
  return toProductCategory(rows[0]);
}

export async function productIngredientsExist(names: string[]): Promise<boolean> {
  if (names.length === 0) return false;
  const rows = await db.select({ name: schema.productIngredients.name }).from(schema.productIngredients).where(inArray(schema.productIngredients.name, names));
  const existing = new Set(rows.map((row) => row.name));
  return names.every((name) => existing.has(name));
}

export async function createProductIngredient(data: ProductIngredientDefinition): Promise<ProductIngredientDefinition> {
  const existing = await db
    .select({ name: schema.productIngredients.name })
    .from(schema.productIngredients)
    .where(sql`lower(${schema.productIngredients.name}) = lower(${data.name})`)
    .limit(1);
  if (existing.length > 0) throw new Error("Nguyên liệu đã tồn tại.");
  const rows = await db.insert(schema.productIngredients).values({ name: data.name, image: data.image || null, imageAlt: data.imageAlt || null }).returning();
  invalidateStore();
  return toProductIngredient(rows[0]);
}

export async function updateProductIngredient(currentName: string, data: ProductIngredientDefinition): Promise<ProductIngredientDefinition> {
  const duplicate = await db.select({ name: schema.productIngredients.name }).from(schema.productIngredients).where(sql`${schema.productIngredients.name} != ${currentName} AND lower(${schema.productIngredients.name}) = lower(${data.name})`).limit(1);
  if (duplicate.length > 0) throw new Error("Tên nguyên liệu đã tồn tại.");

  await db.execute(sql`
    WITH updated_ingredient AS (
      UPDATE "product_ingredients"
      SET "name" = ${data.name}, "image" = ${data.image || null}, "image_alt" = ${data.imageAlt || null}
      WHERE "name" = ${currentName}
      RETURNING "name"
    ), updated_products AS (
      UPDATE "products"
      SET "ingredients" = array_replace("ingredients", ${currentName}, ${data.name})
      WHERE ${currentName} = ANY("ingredients")
        AND EXISTS (SELECT 1 FROM updated_ingredient)
      RETURNING "id"
    )
    SELECT "name" FROM updated_ingredient
  `);
  const rows = await db.select().from(schema.productIngredients).where(eq(schema.productIngredients.name, data.name)).limit(1);
  if (rows.length === 0) throw new Error("Không tìm thấy nguyên liệu.");
  invalidateStore();
  return toProductIngredient(rows[0]);
}

export async function deleteProductIngredient(name: string): Promise<ProductIngredientDefinition> {
  const used = await db.select({ id: schema.products.id }).from(schema.products).where(sql`${name} = ANY(${schema.products.ingredients})`).limit(1);
  if (used.length > 0) throw new Error("Nguyên liệu đang được sản phẩm sử dụng nên chưa thể xóa.");
  const rows = await db.delete(schema.productIngredients).where(eq(schema.productIngredients.name, name)).returning();
  if (rows.length === 0) throw new Error("Không tìm thấy nguyên liệu.");
  invalidateStore();
  return toProductIngredient(rows[0]);
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const rows = await db.insert(schema.products).values({
    productType: data.type,
    slug: data.slug,
    name: data.name,
    shortName: data.shortName,
    category: data.category,
    weight: data.weight,
    price: data.price,
    description: data.description,
    image: data.image,
    imageAlt: data.imageAlt,
    ingredients: data.ingredients,
    usage: data.usage,
    storage: data.storage,
  }).returning();
  if (data.type === "combo") {
    await db.insert(schema.productComboItems).values(data.comboItems.map((item) => ({
      comboProductId: rows[0].id,
      productId: item.productId,
      quantity: item.quantity,
    })));
  }
  invalidateStore();
  return toProduct(rows[0], data.type === "combo" ? data.comboItems : []);
}

export async function updateProduct(id: number, data: Omit<Product, "id">): Promise<Product> {
  const rows = await db.update(schema.products).set({
    productType: data.type,
    slug: data.slug,
    name: data.name,
    shortName: data.shortName,
    category: data.category,
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
  await db.delete(schema.productComboItems).where(eq(schema.productComboItems.comboProductId, id));
  if (data.type === "combo") {
    await db.insert(schema.productComboItems).values(data.comboItems.map((item) => ({
      comboProductId: id,
      productId: item.productId,
      quantity: item.quantity,
    })));
  }
  invalidateStore();
  return toProduct(rows[0], data.type === "combo" ? data.comboItems : []);
}

export async function deleteProduct(id: number): Promise<string> {
  const referenced = await db.select({ id: schema.productComboItems.id }).from(schema.productComboItems).where(eq(schema.productComboItems.productId, id)).limit(1);
  if (referenced.length > 0) throw new Error("Sản phẩm đang nằm trong một combo nên chưa thể xóa.");
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

export async function validateProductCombo(data: Pick<Product, "type" | "comboItems">, currentId?: number): Promise<void> {
  if (data.type === "single") {
    if (data.comboItems.length > 0) throw new Error("Sản phẩm thường không được chứa sản phẩm con.");
    return;
  }
  if (data.comboItems.length < 2) throw new Error("Combo cần có ít nhất 2 sản phẩm.");
  const componentIds = data.comboItems.map((item) => item.productId);
  if (new Set(componentIds).size !== componentIds.length) throw new Error("Mỗi sản phẩm chỉ được xuất hiện một lần trong combo.");
  if (currentId !== undefined && componentIds.includes(currentId)) throw new Error("Combo không thể chứa chính nó.");

  const components = await db.select({ id: schema.products.id, type: schema.products.productType }).from(schema.products).where(inArray(schema.products.id, componentIds));
  if (components.length !== componentIds.length) throw new Error("Có sản phẩm trong combo không còn tồn tại.");
  if (components.some((component) => component.type !== "single")) throw new Error("Combo không thể chứa một combo khác.");

  if (currentId !== undefined) {
    const referenced = await db.select({ id: schema.productComboItems.id }).from(schema.productComboItems).where(eq(schema.productComboItems.productId, currentId)).limit(1);
    if (referenced.length > 0) throw new Error("Sản phẩm đang thuộc một combo khác nên không thể đổi thành combo.");
  }
}

function toProductCategory(row: typeof schema.productCategories.$inferSelect): ProductCategoryDefinition {
  return { value: row.value, label: row.label, description: row.description, image: row.image ?? undefined, imageAlt: row.imageAlt ?? undefined };
}

function toProductIngredient(row: typeof schema.productIngredients.$inferSelect): ProductIngredientDefinition {
  return { name: row.name, image: row.image ?? undefined, imageAlt: row.imageAlt ?? undefined };
}

export async function isImageInUse(imageUrl: string): Promise<boolean> {
  const [productRows, articleRows, orderItemRows, categoryRows, ingredientRows, pageRows] = await Promise.all([
    db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.image, imageUrl)).limit(1),
    db.select({ id: schema.articles.id }).from(schema.articles).where(eq(schema.articles.image, imageUrl)).limit(1),
    db.select({ id: schema.orderItems.id }).from(schema.orderItems).where(eq(schema.orderItems.image, imageUrl)).limit(1),
    db.select({ value: schema.productCategories.value }).from(schema.productCategories).where(eq(schema.productCategories.image, imageUrl)).limit(1),
    db.select({ name: schema.productIngredients.name }).from(schema.productIngredients).where(eq(schema.productIngredients.image, imageUrl)).limit(1),
    db.select({ content: schema.sitePages.content }).from(schema.sitePages),
  ]);
  return productRows.length > 0 || articleRows.length > 0 || orderItemRows.length > 0 || categoryRows.length > 0 || ingredientRows.length > 0 || pageRows.some((row) => Object.values(row.content).includes(imageUrl));
}
