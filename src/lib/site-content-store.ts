import "server-only";

import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sitePages } from "@/lib/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { getDefaultSiteContent, getSitePageDefinition, type SiteContent, type SitePageKey } from "@/lib/site-content";

export async function getSitePageContent(key: SitePageKey): Promise<SiteContent> {
  "use cache";
  cacheLife("max");
  cacheTag("an-vi-site-content");
  const rows = await db.select({ content: sitePages.content }).from(sitePages).where(eq(sitePages.key, key)).limit(1);
  return { ...getDefaultSiteContent(key), ...(rows[0]?.content ?? {}) };
}

export async function getAdminSitePageContent(key: SitePageKey) {
  await requireAdminSession("content:write");
  return getSitePageContent(key);
}

export async function updateSitePageContent(key: SitePageKey, content: SiteContent) {
  const definition = getSitePageDefinition(key);
  if (!definition) throw new Error("Trang nội dung không hợp lệ.");
  const allowedKeys = new Set(definition.fields.map((item) => item.key));
  const clean = Object.fromEntries(Object.entries(content).filter(([fieldKey]) => allowedKeys.has(fieldKey)));
  const merged = { ...getDefaultSiteContent(key), ...clean };
  await db.insert(sitePages).values({ key, content: merged, updatedAt: new Date() }).onConflictDoUpdate({ target: sitePages.key, set: { content: merged, updatedAt: new Date() } });
  revalidateTag("an-vi-site-content", { expire: 0 });
  return merged;
}
