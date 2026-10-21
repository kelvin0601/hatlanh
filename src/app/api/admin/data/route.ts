import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { mutateStore, readStore } from "@/lib/admin-store";
import type { AdminPermission } from "@/lib/admin-permissions";
import { hasPermission } from "@/lib/admin-permissions";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import type { Product } from "@/lib/products";
import type { Article } from "@/lib/articles";
import type { OrderStatus } from "@/lib/commerce";

type Resource = "products" | "articles" | "orders";
const ORDER_STATUSES = new Set<OrderStatus>(["confirmed", "processing", "shipping", "completed", "cancelled"]);
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

function parseProduct(value: unknown, id: number): Product | null {
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
  return { id, slug, name, shortName, weight, price, description, image, imageAlt, ingredients, usage, storage };
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
    const result = await mutateStore((store) => {
      if (resource === "products") {
        const id = Math.max(0, ...store.products.map((product) => product.id)) + 1;
        const product = parseProduct(body.data, id);
        if (!product) throw new Error("Thông tin sản phẩm chưa hợp lệ.");
        if (store.products.some((item) => item.slug === product.slug)) throw new Error("Slug sản phẩm đã tồn tại.");
        store.products.push(product);
        return product;
      }
      const article = parseArticle(body.data);
      if (!article) throw new Error("Thông tin bài viết chưa hợp lệ.");
      if (store.articles.some((item) => item.slug === article.slug)) throw new Error("Slug bài viết đã tồn tại.");
      store.articles.unshift(article);
      return article;
    });
    revalidatePublicContent(resource, "slug" in result ? result.slug : undefined);
    return noStoreJson({ item: result }, { status: 201 });
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
    const result = await mutateStore((store) => {
      if (resource === "products") {
        const id = Number(body.id);
        const index = store.products.findIndex((item) => item.id === id);
        const product = parseProduct(body.data, id);
        if (index < 0 || !product) throw new Error("Không tìm thấy sản phẩm hoặc dữ liệu chưa hợp lệ.");
        if (store.products.some((item) => item.id !== id && item.slug === product.slug)) throw new Error("Slug sản phẩm đã tồn tại.");
        const previousSlug = store.products[index].slug;
        store.products[index] = product;
        return { item: product, previousSlug };
      }
      if (resource === "articles") {
        const currentSlug = text(body.id, 120);
        const index = store.articles.findIndex((item) => item.slug === currentSlug);
        const article = parseArticle(body.data);
        if (index < 0 || !article) throw new Error("Không tìm thấy bài viết hoặc dữ liệu chưa hợp lệ.");
        if (store.articles.some((item) => item.slug !== currentSlug && item.slug === article.slug)) throw new Error("Slug bài viết đã tồn tại.");
        store.articles[index] = article;
        return { item: article, previousSlug: currentSlug };
      }
      const orderId = text(body.id, 80);
      const data = body.data as { status?: unknown };
      const status = data?.status;
      if (!ORDER_STATUSES.has(status as OrderStatus)) throw new Error("Trạng thái đơn hàng không hợp lệ.");
      const order = store.orders.find((item) => item.id === orderId);
      if (!order) throw new Error("Không tìm thấy đơn hàng.");
      order.status = status as OrderStatus;
      return { item: order, previousSlug: "" };
    });
    if (resource !== "orders") {
      revalidatePublicContent(resource, result.previousSlug);
      revalidatePublicContent(resource, "slug" in result.item ? result.item.slug : undefined);
    }
    return noStoreJson({ item: result.item });
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
    const slug = await mutateStore((store) => {
      if (resource === "products") {
        const id = Number(body.id);
        const item = store.products.find((product) => product.id === id);
        if (!item) throw new Error("Không tìm thấy sản phẩm.");
        store.products = store.products.filter((product) => product.id !== id);
        return item.slug;
      }
      const articleSlug = text(body.id, 120);
      if (!store.articles.some((article) => article.slug === articleSlug)) throw new Error("Không tìm thấy bài viết.");
      store.articles = store.articles.filter((article) => article.slug !== articleSlug);
      return articleSlug;
    });
    revalidatePublicContent(resource, slug);
    return noStoreJson({ ok: true });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể xóa dữ liệu." }, { status: 422 });
  }
}
