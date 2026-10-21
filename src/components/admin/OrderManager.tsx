"use client";

import { useState } from "react";
import { ChevronDown, Mail, MapPin, PackageCheck, Phone } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/commerce";
import { getPaymentLabel } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";
import { useAdminSession } from "@/components/admin/AdminShell";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "confirmed", label: "Đã tiếp nhận" },
  { value: "processing", label: "Đang chuẩn bị" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
];

export function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const { csrfToken } = useAdminSession();
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function updateStatus(order: Order, status: OrderStatus) {
    const previous = order.status;
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    const response = await fetch("/api/admin/data", { method: "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ resource: "orders", id: order.id, data: { status } }) });
    if (!response.ok) {
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: previous } : item));
      const result = (await response.json()) as { message?: string };
      setMessage(result.message ?? "Không thể cập nhật đơn hàng.");
    } else setMessage("Đã cập nhật trạng thái đơn hàng.");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6"><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Bán hàng</p><h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Đơn hàng</h1><p className="mt-2 text-[14px] text-muted">{orders.length} đơn đã ghi nhận từ checkout.</p></header>
      {message ? <p aria-live="polite" className="mb-4 rounded-[10px] bg-paper px-4 py-3 text-[13px] text-forest">{message}</p> : null}
      {orders.length === 0 ? <div className="rounded-[14px] bg-paper px-5 py-16 text-center"><PackageCheck className="mx-auto mb-3 h-9 w-9 text-sage" /><p className="font-semibold text-ink">Chưa có đơn hàng</p><p className="mt-1 text-[13px] text-muted">Đơn mới sẽ tự động xuất hiện tại đây.</p></div> : <div className="space-y-3">{orders.map((order) => <article key={order.id} className="overflow-hidden rounded-[14px] bg-paper"><div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"><button type="button" aria-expanded={expanded === order.id} aria-controls={`order-detail-${order.id}`} onClick={() => setExpanded((value) => value === order.id ? null : order.id)} className="min-w-0 text-left"><div className="flex items-center gap-2"><h2 className="font-bold text-ink">{order.id}</h2><ChevronDown aria-hidden="true" className={`h-4 w-4 text-muted transition-transform ${expanded === order.id ? "rotate-180" : ""}`} /></div><p className="mt-1 truncate text-[13px] text-muted">{order.customer.name} · {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.createdAt))}</p><p className="mt-1 font-bold tabular-nums text-ink sm:hidden">{formatPrice(order.total)}</p></button><div className="flex items-center justify-between gap-3"><p className="hidden font-bold tabular-nums text-ink sm:block">{formatPrice(order.total)}</p><label className="sr-only" htmlFor={`status-${order.id}`}>Trạng thái đơn {order.id}</label><select id={`status-${order.id}`} value={order.status} onChange={(event) => updateStatus(order, event.target.value as OrderStatus)} className="h-11 rounded-full border border-border bg-cream px-3 text-[13px] font-semibold text-ink outline-none focus:border-forest">{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></div></div>{expanded === order.id ? <div id={`order-detail-${order.id}`} className="border-t border-border px-4 py-5 sm:px-5"><div className="grid gap-5 lg:grid-cols-2"><div><h3 className="mb-3 text-[14px] font-semibold text-ink">Khách hàng</h3><div className="space-y-2 text-[13px] text-muted"><p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{order.customer.phone}</p><p className="flex items-start gap-2 break-all"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{order.customer.email}</p><p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{order.customer.address}, {order.customer.city}</p><p>Thanh toán: {getPaymentLabel(order.paymentMethod)}</p></div></div><div><h3 className="mb-3 text-[14px] font-semibold text-ink">Sản phẩm</h3><div className="divide-y divide-border">{order.items.map((item) => <div key={item.productId} className="flex justify-between gap-3 py-2 text-[13px]"><span className="text-body">{item.name} × {item.quantity}</span><span className="shrink-0 font-semibold tabular-nums text-ink">{formatPrice(item.price * item.quantity)}</span></div>)}</div></div></div></div> : null}</article>)}</div>}
    </div>
  );
}
