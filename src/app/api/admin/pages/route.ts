import { revalidatePath } from "next/cache";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";
import { isAllowedImageUrl } from "@/lib/r2-storage";
import { getSitePageDefinition, type SiteContent, type SitePageKey } from "@/lib/site-content";
import { updateSitePageContent } from "@/lib/site-content-store";

export async function PATCH(request: Request) {
  const requestCheck = verifyJsonRequest(request, 100_000);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "content:write", true);
  if (!authorization.ok) return authorization.response;

  let body: { key?: unknown; content?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu trang không hợp lệ." }, { status: 400 }); }
  if (typeof body.key !== "string" || typeof body.content !== "object" || body.content === null) return noStoreJson({ message: "Dữ liệu trang không hợp lệ." }, { status: 422 });
  const definition = getSitePageDefinition(body.key);
  if (!definition) return noStoreJson({ message: "Không tìm thấy trang nội dung." }, { status: 404 });

  const raw = body.content as Record<string, unknown>;
  const content: SiteContent = {};
  for (const field of definition.fields) {
    const value = raw[field.key];
    const maxLength = field.type === "gallery" ? 30_000 : 5_000;
    if (typeof value !== "string" || value.length > maxLength) return noStoreJson({ message: `${field.label} không hợp lệ.` }, { status: 422 });
    const clean = value.trim();
    if (field.type === "image" && clean && !isAllowedImageUrl(clean)) return noStoreJson({ message: `${field.label} không phải đường dẫn ảnh hợp lệ.` }, { status: 422 });
    if (field.type === "gallery") {
      try {
        const images = JSON.parse(clean) as unknown;
        if (!Array.isArray(images) || images.length > 30 || images.some((image) => typeof image !== "object" || image === null || typeof (image as { url?: unknown }).url !== "string" || !isAllowedImageUrl((image as { url: string }).url) || typeof (image as { alt?: unknown }).alt !== "string" || (image as { alt: string }).alt.length > 200)) {
          return noStoreJson({ message: `${field.label} không hợp lệ.` }, { status: 422 });
        }
      } catch {
        return noStoreJson({ message: `${field.label} không hợp lệ.` }, { status: 422 });
      }
    }
    content[field.key] = clean;
  }

  try {
    const saved = await updateSitePageContent(body.key as SitePageKey, content);
    revalidatePath(definition.route);
    return noStoreJson({ content: saved });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể lưu nội dung trang." }, { status: 422 });
  }
}
