import { ArticleManager } from "@/components/admin/ArticleManager";
import { readAdminStore } from "@/lib/admin-store";

export default async function AdminArticlesPage() {
  return <ArticleManager initialArticles={(await readAdminStore("content:write")).articles} />;
}
