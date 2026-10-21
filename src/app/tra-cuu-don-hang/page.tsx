"use client";

import { useState, type FormEvent } from "react";
import { Check, Clock3, LoaderCircle, PackageCheck, Search, Truck, XCircle } from "lucide-react";
import { getPaymentLabel, getPaymentStatusLabel, type OrderStatus, type OrderTrackingDto } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

const statusLabels: Record<OrderStatus, string> = {
  confirmed: "Đã tiếp nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderTrackingDto | null>(null);
  const [searched, setSearched] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function searchOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setOrder(null);
    const response = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, phone }),
    });
    const result = (await response.json()) as { order?: OrderTrackingDto; message?: string };
    setPending(false);
    setSearched(true);
    if (!response.ok || !result.order) return setError(result.message ?? "Không thể tra cứu đơn hàng.");
    setOrder(result.order);
  }

  const stage = order?.status === "completed" ? 3 : order?.status === "shipping" ? 2 : order?.status === "processing" ? 1 : 0;

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div className="mx-auto" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Theo dõi hành trình</p>
          <h1 className="mb-4 text-[clamp(2rem,8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink">Tra cứu đơn hàng</h1>
          <p className="mb-8 text-[17px] leading-[1.65] text-body">Nhập mã đơn và số điện thoại đã dùng khi đặt hàng.</p>
          <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={searchOrder}>
            <label className="sr-only" htmlFor="tracking-order-id">Mã đơn hàng</label>
            <input id="tracking-order-id" type="text" required maxLength={20} autoCapitalize="characters" placeholder="AV261021-ABC123" value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} className="h-[52px] rounded-full border border-border bg-paper px-5 text-base text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" />
            <label className="sr-only" htmlFor="tracking-phone">Số điện thoại</label>
            <input id="tracking-phone" type="tel" required minLength={8} maxLength={20} autoComplete="tel" placeholder="Số điện thoại" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-[52px] rounded-full border border-border bg-paper px-5 text-base text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" />
            <button type="submit" disabled={pending} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-forest px-6 text-base font-semibold text-white hover:bg-forest-hover disabled:cursor-wait disabled:opacity-70">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Tra cứu</button>
          </form>
        </div>

        <div className="mx-auto mt-10 max-w-3xl" aria-live="polite">
          {order ? (
            <article className="overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)]">
              <header className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center md:p-7">
                <div><p className="text-[12px] text-muted">Mã đơn hàng</p><h2 className="text-xl font-semibold text-ink">{order.id}</h2></div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold ${order.status === "cancelled" ? "bg-error/10 text-error" : "bg-forest/10 text-forest"}`}>{order.status === "cancelled" ? <XCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />} {statusLabels[order.status]}</span>
              </header>
              <div className="p-5 md:p-7">
                {order.status !== "cancelled" ? <div className="mb-8 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center">
                  {[
                    { icon: PackageCheck, label: "Tiếp nhận" },
                    { icon: Clock3, label: "Đóng gói" },
                    { icon: Truck, label: "Đang giao" },
                  ].map(({ icon: Icon, label }, index) => (
                    <div key={label} className="contents">
                      {index > 0 ? <div className={`h-0.5 ${stage >= index ? "bg-forest" : "bg-border"}`} /> : null}
                      <div className="flex flex-col items-center gap-2 text-center"><span className={`grid h-10 w-10 place-items-center rounded-full ${stage >= index ? "bg-forest text-white" : "bg-sand text-muted"}`}><Icon className="h-5 w-5" /></span><span className={`text-[12px] font-medium ${stage >= index ? "text-forest" : "text-muted"}`}>{label}</span></div>
                    </div>
                  ))}
                </div> : null}
                <div className="grid gap-4 rounded-[14px] bg-cream p-4 sm:grid-cols-3">
                  <div><p className="text-[12px] text-muted">Ngày đặt</p><p className="mt-1 text-[14px] font-medium text-ink">{new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
                  <div><p className="text-[12px] text-muted">Thanh toán</p><p className="mt-1 text-[14px] font-medium text-ink">{getPaymentLabel(order.paymentMethod)} · {getPaymentStatusLabel(order.paymentStatus)}</p></div>
                  <div><p className="text-[12px] text-muted">Tổng cộng</p><p className="mt-1 text-[14px] font-bold text-ink">{formatPrice(order.total)}</p></div>
                </div>
                <div className="mt-5 divide-y divide-border">{order.items.map((item) => <div key={item.productId} className="flex justify-between gap-3 py-3 text-[14px]"><span className="text-body">{item.name} × {item.quantity}</span><span className="shrink-0 font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
              </div>
            </article>
          ) : searched ? (
            <div className="rounded-2xl bg-paper p-8 text-center"><p className="font-semibold text-ink">Chưa tìm thấy đơn hàng</p><p className="mt-2 text-[14px] text-muted">{error || "Hãy kiểm tra lại mã đơn và số điện thoại."}</p></div>
          ) : (
            <div className="rounded-2xl bg-paper p-8 text-center"><p className="text-[15px] text-muted">Dữ liệu được đối chiếu trực tiếp với hệ thống đơn hàng và không lưu thông tin giao hàng trên thiết bị này.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}
