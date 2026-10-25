import Link from "next/link";
import { ExternalLink, FilePenLine } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";
import { SITE_PAGE_DEFINITIONS } from "@/lib/site-content";

export default async function AdminSiteContentPage() {
  await requireAdminSession("content:write");
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage">Website</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Nội dung trang</h1><p className="mt-1 text-[13px] text-muted">Chỉnh sửa nội dung chữ và hình ảnh của từng trang.</p></header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SITE_PAGE_DEFINITIONS.map((page) => <article key={page.key} className="rounded-[14px] bg-paper p-4"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-forest/10 text-forest"><FilePenLine className="h-4 w-4" /></span><h2 className="mt-3 font-semibold text-ink">{page.title}</h2><p className="mt-1 min-h-10 text-[12px] leading-5 text-muted">{page.description}</p><div className="mt-4 flex items-center justify-between"><Link href={`/admin/noi-dung/${page.key}`} className="rounded-full bg-forest px-3 py-2 text-[12px] font-semibold text-white">Chỉnh sửa</Link><Link href={page.route} target="_blank" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-sand hover:text-forest" aria-label={`Xem ${page.title}`}><ExternalLink className="h-4 w-4" /></Link></div></article>)}
      </div>
    </div>
  );
}
