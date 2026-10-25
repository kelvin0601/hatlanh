import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { createProductIngredient, deleteProductIngredient, updateProductIngredient } from "@/lib/admin-store";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import { isAllowedImageUrl } from "@/lib/r2-storage";
import type { ProductIngredientDefinition } from "@/lib/product-ingredients";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function parseIngredient(value: unknown): ProductIngredientDefinition | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  const name = text(item.name, 100);
  const image = text(item.image, 300);
  const imageAlt = text(item.imageAlt, 200);
  if (name.length < 2) return null;
  if ((image && (!isAllowedImageUrl(image) || !imageAlt)) || (!image && imageAlt)) return null;
  return { name, image: image || undefined, imageAlt: imageAlt || undefined };
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 4_096);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: unknown;
  try { body = await request.json(); } catch { return noStoreJson({ message: "Dữ liệu nguyên liệu không hợp lệ." }, { status: 400 }); }
  const ingredient = parseIngredient(body);
  if (!ingredient) return noStoreJson({ message: "Thông tin hoặc ảnh nguyên liệu chưa hợp lệ." }, { status: 422 });

  try {
    const created = await createProductIngredient(ingredient);
    revalidatePath("/san-pham");
    return noStoreJson({ ingredient: created }, { status: 201 });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể tạo nguyên liệu." }, { status: 422 });
  }
}

export async function PATCH(request: Request) {
  const requestCheck = verifyJsonRequest(request, 4_096);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: { currentName?: unknown; data?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu nguyên liệu không hợp lệ." }, { status: 400 }); }
  const currentName = text(body.currentName, 100);
  const data = parseIngredient(body.data);
  if (!currentName || !data) return noStoreJson({ message: "Thông tin hoặc ảnh nguyên liệu chưa hợp lệ." }, { status: 422 });

  try {
    const updated = await updateProductIngredient(currentName, data);
    revalidatePath("/san-pham");
    return noStoreJson({ ingredient: updated });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể cập nhật nguyên liệu." }, { status: 422 });
  }
}

export async function DELETE(request: Request) {
  const requestCheck = verifyJsonRequest(request, 2_048);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "catalog:write", true);
  if (!authorization.ok) return authorization.response;

  let body: { name?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu nguyên liệu không hợp lệ." }, { status: 400 }); }
  const name = text(body.name, 100);
  if (!name) return noStoreJson({ message: "Nguyên liệu không hợp lệ." }, { status: 422 });

  try {
    const deleted = await deleteProductIngredient(name);
    revalidatePath("/san-pham");
    return noStoreJson({ ingredient: deleted });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể xóa nguyên liệu." }, { status: 422 });
  }
}
