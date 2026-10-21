"use client";

import { useState, type FormEvent } from "react";
import { Check, Clock3, PackageCheck, Search, Truck } from "lucide-react";
import { readStoredOrders } from "@/components/commerce/ShopProvider";
import { getPaymentLabel, type Order } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

export default function OrderTrackingPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  function searchOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.replaceAll(" ", "").toLowerCase();
    const found = readStoredOrders().find(
      (item) => item.id.replaceAll(" ", "").toLowerCase() === normalized || item.customer.phone.replaceAll(" ", "") === normalized,
    );
    setOrder(found ?? null);
    setSearched(true);
  }

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div className="mx-auto" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Theo dõi hành trình</p>
          <h1 className="mb-4 text-[clamp(2rem,8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink">Tra cứu đơn hàng</h1>
          <p className="mb-8 text-[17px] leading-[1.65] text-body">Nhập mã đơn hàng hoặc số điện thoại đã dùng khi thanh toán.</p>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={searchOrder}>
            <input type="text" required placeholder="Ví dụ: HL261021-ABC123" value={query} onChange={(event) => setQuery(event.target.value)} className="h-[52px] flex-1 rounded-full border border-border bg-paper px-5 text-base text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" aria-label="Mã đơn hàng hoặc số điện thoại" />
            <button type="submit" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-forest px-7 text-base font-semibold text-white hover:bg-forest-hover"><Search className="h-4 w-4" /> Tra cứu</button>
          </form>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          {order ? (
            <article className="overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)]">
              <header className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center md:p-7">
                <div><p className="text-[12px] text-muted">Mã đơn hàng</p><h2 className="text-xl font-semibold text-ink">{order.id}</h2></div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-forest/10 px-3 py-1.5 text-[13px] font-semibold text-forest"><Check className="h-4 w-4" /> Đã tiếp nhận</span>
              </header>
              <div className="p-5 md:p-7">
                <div className="mb-8 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center">
                  {[
                    { icon: PackageCheck, label: "Tiếp nhận", active: true },
                    { icon: Clock3, label: "Đóng gói", active: false },
                    { icon: Truck, label: "Đang giao", active: false },
                  ].map(({ icon: Icon, label, active }, index) => (
                    <div key={label} className="contents">
                      {index > 0 ? <div className="h-0.5 bg-border" /> : null}
                      <div className="flex flex-col items-center gap-2 text-center"><span className={`grid h-10 w-10 place-items-center rounded-full ${active ? "bg-forest text-white" : "bg-sand text-muted"}`}><Icon className="h-5 w-5" /></span><span className={`text-[12px] font-medium ${active ? "text-forest" : "text-muted"}`}>{label}</span></div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 rounded-[14px] bg-cream p-4 sm:grid-cols-3">
                  <div><p className="text-[12px] text-muted">Ngày đặt</p><p className="mt-1 text-[14px] font-medium text-ink">{new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
                  <div><p className="text-[12px] text-muted">Thanh toán</p><p className="mt-1 text-[14px] font-medium text-ink">{getPaymentLabel(order.paymentMethod)}</p></div>
                  <div><p className="text-[12px] text-muted">Tổng cộng</p><p className="mt-1 text-[14px] font-bold text-ink">{formatPrice(order.total)}</p></div>
                </div>
              </div>
            </article>
          ) : searched ? (
            <div className="rounded-2xl bg-paper p-8 text-center"><p className="font-semibold text-ink">Chưa tìm thấy đơn hàng</p><p className="mt-2 text-[14px] text-muted">Hãy kiểm tra lại mã đơn hoặc tra cứu trên đúng thiết bị đã dùng để đặt hàng.</p></div>
          ) : (
            <div className="rounded-2xl bg-paper p-8 text-center"><p className="text-[15px] text-muted">Thông tin đơn gần đây được lưu an toàn trên thiết bị của bạn.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}
