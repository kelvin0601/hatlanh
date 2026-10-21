import { Banknote, FileText, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { readAdminDashboardStore } from "@/lib/admin-store";
import { formatPrice } from "@/lib/products";

export default async function AdminDashboardPage() {
  const store = await readAdminDashboardStore();
  const activeOrders = store.orders.filter((order) => !["completed", "cancelled"].includes(order.status));
  const revenue = store.orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: "Sản phẩm", value: store.products.length.toString(), icon: Package, tone: "bg-[#e9f0e4] text-forest" },
    { label: "Đơn đang xử lý", value: activeOrders.length.toString(), icon: ShoppingCart, tone: "bg-[#f6ead8] text-[#8a5b23]" },
    { label: "Bài viết", value: store.articles.length.toString(), icon: FileText, tone: "bg-[#e7ecec] text-[#3f6762]" },
    { label: "Doanh thu ghi nhận", value: formatPrice(revenue), icon: TrendingUp, tone: "bg-[#f0e7e2] text-[#8a5140]" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-7"><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">An Vị Admin</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Tổng quan cửa hàng</h1><p className="mt-2 text-[14px] text-muted">Theo dõi nội dung và hoạt động bán hàng tại một nơi.</p></header>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Chỉ số cửa hàng">
        {stats.map(({ label, value, icon: Icon, tone }) => <article key={label} className="rounded-[14px] bg-paper p-4 sm:p-5"><span className={`mb-4 grid h-10 w-10 place-items-center rounded-[11px] ${tone}`}><Icon className="h-5 w-5" /></span><p className="break-words text-xl font-bold tabular-nums text-ink sm:text-2xl">{value}</p><p className="mt-1 text-[12px] leading-5 text-muted sm:text-[13px]">{label}</p></article>)}
      </section>
      <section className="mt-6 rounded-[14px] bg-paper p-4 sm:p-6" aria-labelledby="recent-orders">
        <div className="mb-4 flex items-center justify-between"><div><h2 id="recent-orders" className="text-lg font-semibold text-ink">Đơn hàng gần đây</h2><p className="text-[12px] text-muted">5 đơn mới nhất</p></div><Banknote className="h-5 w-5 text-sage" /></div>
        {store.orders.length === 0 ? <div className="rounded-[12px] bg-cream px-4 py-10 text-center text-[14px] text-muted">Chưa có đơn hàng. Đơn mới từ checkout sẽ xuất hiện tại đây.</div> : <div className="divide-y divide-border">{store.orders.slice(0, 5).map((order) => <div key={order.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"><div className="min-w-0"><p className="font-semibold text-ink">{order.id}</p><p className="truncate text-[13px] text-muted">{order.customer.name} · {order.customer.phone}</p></div><p className="text-[13px] text-muted">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.createdAt))}</p><p className="font-bold tabular-nums text-ink">{formatPrice(order.total)}</p></div>)}</div>}
      </section>
    </div>
  );
}
