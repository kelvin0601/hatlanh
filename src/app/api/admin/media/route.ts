import { authorizeAdminRequest } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/admin-permissions";
import { isImageInUse } from "@/lib/admin-store";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import {
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  SUPPORTED_IMAGE_TYPES,
  deleteImageFromR2,
  detectImageType,
  getR2ConfigurationStatus,
  listImagesFromR2,
  optimizeImageForUpload,
  uploadImageToR2,
} from "@/lib/r2-storage";

const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

function configurationError(error: unknown) {
  if (error instanceof Error && (error.message === "R2_CONFIGURATION_MISSING" || error.message === "R2_PUBLIC_URL_INVALID")) {
    return noStoreJson({ message: "Kho ảnh R2 chưa được cấu hình đầy đủ trên server." }, { status: 503 });
  }
  return null;
}

export async function GET(request: Request) {
  const authorization = await authorizeAdminRequest(request);
  if (!authorization.ok) return authorization.response;
  const url = new URL(request.url);
  if (url.searchParams.get("list") === "1") {
    const folder = url.searchParams.get("folder") ?? "";
    const allowedFolders = ["products", "articles", "categories", "ingredients", "pages"] as const;
    if (folder && !allowedFolders.includes(folder as (typeof allowedFolders)[number])) return noStoreJson({ message: "Nhóm ảnh không hợp lệ." }, { status: 422 });
    try {
      const library = await listImagesFromR2({ folder: folder ? folder as (typeof allowedFolders)[number] : undefined, cursor: url.searchParams.get("cursor") ?? undefined, limit: 48 });
      return noStoreJson(library);
    } catch (error) {
      const response = configurationError(error);
      if (response) return response;
      console.error("R2 image listing failed", error);
      return noStoreJson({ message: "Không thể tải thư viện ảnh từ R2." }, { status: 502 });
    }
  }
  return noStoreJson({
    ...getR2ConfigurationStatus(),
    maxBytes: MAX_IMAGE_BYTES,
    maxDimension: MAX_IMAGE_DIMENSION,
    optimizedType: "image/webp",
    quality: 88,
    acceptedTypes: SUPPORTED_IMAGE_TYPES,
  });
}

export async function POST(request: Request) {
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return noStoreJson({ message: "Chỉ chấp nhận biểu mẫu tải tệp." }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BYTES) {
    return noStoreJson({ message: "Ảnh vượt quá giới hạn 8 MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return noStoreJson({ message: "Không thể đọc tệp tải lên." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = formData.get("folder");
  if (!(file instanceof File) || !["products", "articles", "categories", "ingredients", "pages"].includes(String(folder))) {
    return noStoreJson({ message: "Tệp hoặc nhóm ảnh không hợp lệ." }, { status: 422 });
  }
  const permission = folder === "articles" || folder === "pages" ? "content:write" : "catalog:write";
  if (!hasPermission(authorization.session.user.role, permission)) {
    return noStoreJson({ message: "Tài khoản không có quyền tải ảnh cho nội dung này." }, { status: 403 });
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    return noStoreJson({ message: "Ảnh phải có dung lượng từ 1 byte đến 8 MB." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedType = detectImageType(bytes);
  if (!detectedType) {
    return noStoreJson({ message: "Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF hợp lệ." }, { status: 415 });
  }

  try {
    const optimized = await optimizeImageForUpload(bytes);
    const uploaded = await uploadImageToR2({ bytes: optimized.bytes, filename: file.name, contentType: optimized.contentType, folder: folder as "products" | "articles" | "categories" | "ingredients" | "pages" });
    return noStoreJson({ image: { ...uploaded, width: optimized.width, height: optimized.height, originalSize: optimized.originalSize, savedBytes: Math.max(0, optimized.originalSize - uploaded.size) } }, { status: 201 });
  } catch (error) {
    const response = configurationError(error);
    if (response) return response;
    if (error instanceof Error && (error.message === "IMAGE_DIMENSIONS_INVALID" || error.message.includes("Input image exceeds pixel limit"))) {
      return noStoreJson({ message: "Kích thước hoặc số điểm ảnh của ảnh không hợp lệ." }, { status: 422 });
    }
    console.error("R2 image optimization or upload failed", error);
    return noStoreJson({ message: "Không thể tải ảnh lên R2. Vui lòng thử lại." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const requestCheck = verifyJsonRequest(request, 2_048);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, undefined, true);
  if (!authorization.ok) return authorization.response;
  if (!hasPermission(authorization.session.user.role, "catalog:write") && !hasPermission(authorization.session.user.role, "content:write")) {
    return noStoreJson({ message: "Tài khoản không có quyền xóa ảnh." }, { status: 403 });
  }

  let body: { url?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return noStoreJson({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  if (typeof body.url !== "string" || body.url.length > 500) {
    return noStoreJson({ message: "Đường dẫn ảnh không hợp lệ." }, { status: 422 });
  }
  if (await isImageInUse(body.url)) {
    return noStoreJson({ message: "Ảnh vẫn đang được sử dụng và không thể xóa." }, { status: 409 });
  }

  try {
    await deleteImageFromR2(body.url);
    return noStoreJson({ ok: true });
  } catch (error) {
    const response = configurationError(error);
    if (response) return response;
    if (error instanceof Error && error.message === "R2_IMAGE_NOT_MANAGED") {
      return noStoreJson({ message: "Ảnh này không thuộc vùng lưu trữ do hệ thống quản lý." }, { status: 422 });
    }
    console.error("R2 image deletion failed", error);
    return noStoreJson({ message: "Không thể xóa ảnh khỏi R2. Vui lòng thử lại." }, { status: 502 });
  }
}
