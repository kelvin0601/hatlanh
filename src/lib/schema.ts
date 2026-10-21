import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role", ["owner", "admin", "editor", "fulfillment"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "bank"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "awaiting_payment", "pay_on_delivery", "paid", "failed", "refunded"]);
export const orderStatusEnum = pgEnum("order_status", ["confirmed", "processing", "shipping", "completed", "cancelled"]);
export const emailStatusEnum = pgEnum("email_status", ["sent", "not_configured", "failed"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  shortName: varchar("short_name", { length: 100 }).notNull(),
  weight: varchar("weight", { length: 30 }).notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 300 }).notNull(),
  imageAlt: varchar("image_alt", { length: 200 }).notNull(),
  ingredients: text("ingredients").array().notNull(),
  usage: text("usage").notNull(),
  storage: text("storage").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  image: varchar("image", { length: 300 }).notNull(),
  imageAlt: varchar("image_alt", { length: 200 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 80 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }).notNull(),
  customerEmail: varchar("customer_email", { length: 150 }).notNull(),
  customerAddress: varchar("customer_address", { length: 200 }).notNull(),
  customerCity: varchar("customer_city", { length: 100 }).notNull(),
  customerNote: text("customer_note").default("").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull(),
  status: orderStatusEnum("status").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull(),
  total: integer("total").notNull(),
  emailStatus: emailStatusEnum("email_status").notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 80 }).unique(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 80 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  weight: varchar("weight", { length: 30 }).notNull(),
  image: varchar("image", { length: 300 }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  role: adminRoleEnum("role").notNull(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
