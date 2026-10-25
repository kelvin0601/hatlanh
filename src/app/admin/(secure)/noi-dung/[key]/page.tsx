import { notFound } from "next/navigation";
import { PageContentManager } from "@/components/admin/PageContentManager";
import { getSitePageDefinition, type SitePageKey } from "@/lib/site-content";
import { getAdminSitePageContent } from "@/lib/site-content-store";

export default async function AdminSiteContentEditorPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const definition = getSitePageDefinition(key);
  if (!definition) notFound();
  const content = await getAdminSitePageContent(key as SitePageKey);
  return <PageContentManager definition={definition} initialContent={content} />;
}
