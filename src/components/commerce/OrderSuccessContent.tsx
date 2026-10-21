"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2, CircleDollarSign, MailCheck, MailWarning, MapPin, PackageCheck } from "lucide-react";
import { readLastOrder, useShop } from "@/components/commerce/ShopProvider";
import { getPaymentLabel } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

export function OrderSuccessContent() {
  const order = useSyncExternalStore(() => () => undefined, readLastOrder, () => null);
  const ready = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const announced = useRef(false);
  const { notify } = useShop();

  useEffect(() => {
    if (order && !announced.current) {
      announced.current = true;
      notify(`Đặt hàng thành công! Mã đơn của bạn là ${order.id}.`);
    }
  }, [notify, order]);

  if (!ready) return <section className="min-h-[55vh] bg-cream" aria-label="Đang tải thông tin đơn hàng" />;

  if (!order) {
    return (
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div className="mx-auto max-w-lg px-5 text-center">
          <PackageCheck className="mx-auto mb-6 h-16 w-16 text-forest" />
          <h1 className="mb-4 text-3xl font-medium text-ink">Không tìm thấy đơn hàng gần nhất</h1>
          <p className="mb-8 text-body">Thông tin xác nhận chỉ được lưu trên thiết bị đã dùng để đặt hàng.</p>
          <Link href="/san-pham" className="inline-flex h-[52px] items-center rounded-full bg-forest px-7 font-semibold text-white">Khám phá sản phẩm</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-forest/10">
            <CheckCircle2 className="h-11 w-11 text-forest" />
          </div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Đơn hàng {order.id}</p>
          <h1 className="mb-4 text-[clamp(2rem,8vw,2.75rem)] font-medium leading-[1.15] text-ink">Đặt hàng thành công!</h1>
          <p className="mx-auto max-w-xl text-[17px] leading-[1.65] text-body">
            Cảm ơn {order.customer.name}. An Vị đã tiếp nhận đơn và sẽ liên hệ xác nhận trước khi giao.
          </p>
        </header>

        <div className={`mb-6 flex items-start gap-3 rounded-[14px] border p-4 ${order.emailStatus === "sent" ? "border-forest/15 bg-forest/5" : "border-wheat/30 bg-wheat/10"}`} role="status">
          {order.emailStatus === "sent" ? <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" /> : <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-wheat" />}
          <div>
            <p className="text-[14px] font-semibold text-ink">
              {order.emailStatus === "sent" ? `Email xác nhận đã gửi tới ${order.customer.email}` : order.emailStatus === "failed" ? "Đơn đã tạo nhưng email xác nhận chưa gửi được" : "Website đang ở chế độ demo email"}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-muted">
              {order.emailStatus === "sent" ? "Hãy kiểm tra cả thư mục quảng cáo hoặc spam nếu chưa thấy email." : "Mã đơn bên dưới vẫn hợp lệ. Cấu hình dịch vụ email để gửi xác nhận tự động."}
            </p>
          </div>
        </div>

        {order.paymentMethod === "bank" ? (
          <div className="mb-6 flex items-start gap-3 rounded-[14px] bg-ink p-5 text-white">
            <CircleDollarSign className="mt-0.5 h-6 w-6 shrink-0 text-[#d7e2cb]" />
            <div><h2 className="font-semibold">Đơn hàng đang chờ chuyển khoản</h2><p className="mt-1 text-[14px] leading-6 text-white/75">An Vị sẽ liên hệ qua {order.customer.phone} để gửi thông tin tài khoản. Chỉ chuyển khoản sau khi đã đối chiếu đúng mã đơn {order.id}.</p></div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)]">
          <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-3 md:p-6">
            <div><p className="text-[12px] text-muted">Mã đơn hàng</p><p className="mt-1 font-bold text-ink">{order.id}</p></div>
            <div><p className="text-[12px] text-muted">Ngày đặt</p><p className="mt-1 font-medium text-ink">{new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
            <div><p className="text-[12px] text-muted">Thanh toán</p><p className="mt-1 font-medium text-ink">{getPaymentLabel(order.paymentMethod)}</p></div>
          </div>
          <div className="p-5 md:p-6">
            <h2 className="mb-4 text-[18px] font-semibold text-ink">Chi tiết đơn hàng</h2>
            <div className="flex flex-col divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-4 py-3 text-[14px]">
                  <div><p className="font-medium text-ink">{item.name} × {item.quantity}</p><p className="text-[12px] text-muted">{item.weight}</p></div>
                  <p className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 ml-auto max-w-xs space-y-2 border-t border-border pt-4 text-[14px]">
              <div className="flex justify-between"><span className="text-muted">Tạm tính</span><span className="text-ink">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Vận chuyển</span><span className="text-ink">{order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}</span></div>
              <div className="flex justify-between pt-2 text-[18px] font-bold"><span className="text-ink">Tổng cộng</span><span className="text-ink">{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border bg-cream/60 p-5 md:p-6"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest" /><div><p className="text-[13px] font-semibold text-ink">Giao tới {order.customer.name}</p><p className="mt-1 text-[13px] leading-5 text-muted">{order.customer.address}, {order.customer.city} · {order.customer.phone}</p></div></div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/tra-cuu-don-hang" className="inline-flex h-[52px] items-center justify-center rounded-full bg-forest px-7 font-semibold text-white hover:bg-forest-hover">Tra cứu đơn hàng</Link>
          <Link href="/san-pham" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-forest/20 px-6 font-medium text-forest hover:bg-forest/5">Tiếp tục mua sắm <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
