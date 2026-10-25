import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { createProductCategory, deleteProductCategory, updateProductCategory } from "@/lib/admin-store";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import { isAllowedImageUrl } from "@/lib/r2-storage";
import { slugify } from "@/lib/slugify";
import type { ProductCategoryDefinition } from "@/lib/product-categories";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseCategory(value: unknown, includeValue: boolean): ProductCategoryDefinition | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  const label = text(item.label, 100);
  const description = text(item.description, 500);
  const image = text(item.image, 300);
  const imageAlt = text(item.imageAlt, 200);
  const categoryValue = includeValue ? slugify(label) : "placeholder";
  if (label.length < 2 || description.length < 10 || !categoryValue || categoryValue.length > 40) return null;
  if ((image && (!isAllowedImageUrl(image) || !imageAlt)) || (!image && imageAlt)) return null;
  return { value: categoryValue, label, description, image: image || undefined, imageAlt: imageAlt || undefined };
}

function revalidateCategory(value: string) {
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/danh-muc/${value}`);
  revalidatePath("/sitemap.xml");
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 8_192);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: unknown;
  try { body = await request.json(); } catch { return noStoreJson({ message: "Dữ liệu danh mục không hợp lệ." }, { status: 400 }); }
  const category = parseCategory(body, true);
  if (!category) return noStoreJson({ message: "Thông tin hoặc ảnh danh mục chưa hợp lệ." }, { status: 422 });

  try {
    const created = await createProductCategory(category);
    revalidateCategory(created.value);
    return noStoreJson({ category: created }, { status: 201 });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể tạo danh mục." }, { status: 422 });
  }
}

export async function PATCH(request: Request) {
  const requestCheck = verifyJsonRequest(request, 8_192);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: { value?: unknown; data?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu danh mục không hợp lệ." }, { status: 400 }); }
  const value = text(body.value, 40);
  const data = parseCategory(body.data, false);
  if (!value || !data) return noStoreJson({ message: "Thông tin hoặc ảnh danh mục chưa hợp lệ." }, { status: 422 });

  try {
    const updated = await updateProductCategory(value, data);
    revalidateCategory(value);
    return noStoreJson({ category: updated });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể cập nhật danh mục." }, { status: 422 });
  }
}

export async function DELETE(request: Request) {
  const requestCheck = verifyJsonRequest(request, 2_048);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: { value?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu danh mục không hợp lệ." }, { status: 400 }); }
  const value = text(body.value, 40);
  if (!value) return noStoreJson({ message: "Danh mục không hợp lệ." }, { status: 422 });

  try {
    const deleted = await deleteProductCategory(value);
    revalidateCategory(value);
    return noStoreJson({ category: deleted });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể xóa danh mục." }, { status: 422 });
  }
}
