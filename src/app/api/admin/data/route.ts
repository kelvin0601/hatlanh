import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import {
  readStore,
  createProduct,
  updateProduct,
  deleteProduct,
  createArticle,
  updateArticle,
  deleteArticle,
  updateOrderStatus,
  productSlugExists,
  articleSlugExists,
} from "@/lib/admin-store";
import type { AdminPermission } from "@/lib/admin-permissions";
import { hasPermission } from "@/lib/admin-permissions";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import type { Product } from "@/lib/products";
import type { Article } from "@/lib/articles";
import type { OrderStatus, PaymentStatus } from "@/lib/commerce";

type Resource = "products" | "articles" | "orders";
const ORDER_STATUSES = new Set<OrderStatus>(["confirmed", "processing", "shipping", "completed", "cancelled"]);
const PAYMENT_STATUSES = new Set<PaymentStatus>(["pending", "awaiting_payment", "pay_on_delivery", "paid", "failed", "refunded"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function permissionFor(resource: Resource, write: boolean): AdminPermission {
  if (resource === "products") return "catalog:write";
  if (resource === "articles") return "content:write";
  return write ? "orders:write" : "orders:read";
}

function parseResource(value: unknown): Resource | null {
  return value === "products" || value === "articles" || value === "orders" ? value : null;
}

function text(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseProduct(value: unknown): Omit<Product, "id"> | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  const slug = text(item.slug, 100);
  const name = text(item.name, 120);
  const shortName = text(item.shortName, 60);
  const weight = text(item.weight, 30);
  const description = text(item.description, 500);
  const image = text(item.image, 300);
  const imageAlt = text(item.imageAlt, 180);
  const usage = text(item.usage, 600);
  const storage = text(item.storage, 400);
  const price = Number(item.price);
  const ingredients = Array.isArray(item.ingredients) ? item.ingredients.map((ingredient) => text(ingredient, 60)).filter(Boolean).slice(0, 30) : [];
  if (!SLUG_PATTERN.test(slug) || name.length < 2 || !shortName || !weight || !description || !image.startsWith("/") || !imageAlt || !usage || !storage || !Number.isInteger(price) || price < 1000 || ingredients.length === 0) return null;
  return { slug, name, shortName, weight, price, description, image, imageAlt, ingredients, usage, storage };
}

function parseArticle(value: unknown): Article | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  const slug = text(item.slug, 120);
  const title = text(item.title, 180);
  const excerpt = text(item.excerpt, 400);
  const category = text(item.category, 60);
  const date = text(item.date, 20);
  const image = text(item.image, 300);
  const imageAlt = text(item.imageAlt, 180);
  const content = text(item.content, 30_000);
  if (!SLUG_PATTERN.test(slug) || title.length < 5 || excerpt.length < 10 || !category || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !image.startsWith("/") || !imageAlt || content.length < 20) return null;
  return { slug, title, excerpt, category, date, image, imageAlt, content };
}

function revalidatePublicContent(resource: Resource, slug?: string) {
  if (resource === "products") {
    revalidatePath("/");
    revalidatePath("/san-pham");
    if (slug) revalidatePath(`/san-pham/${slug}`);
  }
  if (resource === "articles") {
    revalidatePath("/");
    revalidatePath("/goc-song-lanh");
    if (slug) revalidatePath(`/goc-song-lanh/${slug}`);
  }
}

export async function GET(request: Request) {
  const authorization = await authorizeAdminRequest(request);
  if (!authorization.ok) return authorization.response;
  const store = await readStore();
  return noStoreJson({ data: {
    products: hasPermission(authorization.session.user.role, "catalog:write") ? store.products : [],
    articles: hasPermission(authorization.session.user.role, "content:write") ? store.articles : [],
    orders: hasPermission(authorization.session.user.role, "orders:read") ? store.orders : [],
    updatedAt: store.updatedAt,
  } });
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 96_000);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;
  let body: { resource?: unknown; data?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  const resource = parseResource(body.resource);
  if (!resource || resource === "orders") return noStoreJson({ message: "Loại dữ liệu không hợp lệ." }, { status: 422 });
  if (!hasPermission(authorization.session.user.role, permissionFor(resource, true))) return noStoreJson({ message: "Tài khoản không có quyền thực hiện thao tác này." }, { status: 403 });

  try {
    if (resource === "products") {
      const data = parseProduct(body.data);
      if (!data) throw new Error("Thông tin sản phẩm chưa hợp lệ.");
      if (await productSlugExists(data.slug)) throw new Error("Slug sản phẩm đã tồn tại.");
      const product = await createProduct(data);
      revalidatePublicContent(resource, product.slug);
      return noStoreJson({ item: product }, { status: 201 });
    }
    const data = parseArticle(body.data);
    if (!data) throw new Error("Thông tin bài viết chưa hợp lệ.");
    if (await articleSlugExists(data.slug)) throw new Error("Slug bài viết đã tồn tại.");
    const article = await createArticle(data);
    revalidatePublicContent(resource, article.slug);
    return noStoreJson({ item: article }, { status: 201 });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể tạo dữ liệu." }, { status: 422 });
  }
}

export async function PATCH(request: Request) {
  const requestCheck = verifyJsonRequest(request, 96_000);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;
  let body: { resource?: unknown; id?: unknown; data?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  const resource = parseResource(body.resource);
  if (!resource) return noStoreJson({ message: "Loại dữ liệu không hợp lệ." }, { status: 422 });
  if (!hasPermission(authorization.session.user.role, permissionFor(resource, true))) return noStoreJson({ message: "Tài khoản không có quyền thực hiện thao tác này." }, { status: 403 });

  try {
    if (resource === "products") {
      const id = Number(body.id);
      const data = parseProduct(body.data);
      if (!data) throw new Error("Thông tin sản phẩm chưa hợp lệ.");
      if (await productSlugExists(data.slug, id)) throw new Error("Slug sản phẩm đã tồn tại.");
      const product = await updateProduct(id, data);
      revalidatePublicContent(resource, product.slug);
      return noStoreJson({ item: product });
    }
    if (resource === "articles") {
      const currentSlug = text(body.id, 120);
      const data = parseArticle(body.data);
      if (!data) throw new Error("Thông tin bài viết chưa hợp lệ.");
      if (await articleSlugExists(data.slug, currentSlug)) throw new Error("Slug bài viết đã tồn tại.");
      const article = await updateArticle(currentSlug, data);
      revalidatePublicContent(resource, currentSlug);
      revalidatePublicContent(resource, article.slug);
      return noStoreJson({ item: article });
    }
    const orderId = text(body.id, 80);
    const data = body.data as { status?: unknown; paymentStatus?: unknown };
    const status = data?.status;
    const paymentStatus = data?.paymentStatus;
    if (status === undefined && paymentStatus === undefined) throw new Error("Không có trạng thái cần cập nhật.");
    if (status !== undefined && !ORDER_STATUSES.has(status as OrderStatus)) throw new Error("Trạng thái đơn hàng không hợp lệ.");
    if (paymentStatus !== undefined && !PAYMENT_STATUSES.has(paymentStatus as PaymentStatus)) throw new Error("Trạng thái thanh toán không hợp lệ.");
    const order = await updateOrderStatus(orderId, {
      status: status as string | undefined,
      paymentStatus: paymentStatus as string | undefined,
    });
    return noStoreJson({ item: order });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể cập nhật dữ liệu." }, { status: 422 });
  }
}

export async function DELETE(request: Request) {
  const requestCheck = verifyJsonRequest(request, 16_384);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;
  let body: { resource?: unknown; id?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  const resource = parseResource(body.resource);
  if (!resource || resource === "orders") return noStoreJson({ message: "Không thể xóa loại dữ liệu này." }, { status: 422 });
  if (!hasPermission(authorization.session.user.role, permissionFor(resource, true))) return noStoreJson({ message: "Tài khoản không có quyền thực hiện thao tác này." }, { status: 403 });

  try {
    if (resource === "products") {
      const id = Number(body.id);
      const slug = await deleteProduct(id);
      revalidatePublicContent(resource, slug);
      return noStoreJson({ ok: true });
    }
    const articleSlug = text(body.id, 120);
    const slug = await deleteArticle(articleSlug);
    revalidatePublicContent(resource, slug);
    return noStoreJson({ ok: true });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể xóa dữ liệu." }, { status: 422 });
  }
}
