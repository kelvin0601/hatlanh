"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Building2, Check, LoaderCircle, LockKeyhole, PackageCheck, WalletCards } from "lucide-react";
import { useShop } from "@/components/commerce/ShopProvider";
import { calculateOrder, resolveCart, type CheckoutCustomer, type Order, type PaymentMethod } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

const fieldClassName = "h-[52px] rounded-[12px] border border-border bg-cream px-4 text-base text-body outline-none transition-shadow focus:border-forest focus:ring-2 focus:ring-forest/20";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, hydrated, clearCart, saveOrder } = useShop();
  const items = resolveCart(cart);
  const totals = calculateOrder(items);
  const [form, setForm] = useState<CheckoutCustomer>({ name: "", phone: "", email: "", address: "", city: "", note: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const idempotencyKeyRef = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof CheckoutCustomer, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    setError("");
    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = crypto.randomUUID();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, paymentMethod, cart, idempotencyKey: idempotencyKeyRef.current }),
      });
      const result = (await response.json()) as { order?: Order; message?: string };
      if (!response.ok || !result.order) throw new Error(result.message ?? "Không thể tạo đơn hàng.");

      saveOrder(result.order);
      clearCart();
      router.push(`/dat-hang-thanh-cong?order=${encodeURIComponent(result.order.id)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <section className="min-h-[50vh] bg-cream" aria-label="Đang tải trang thanh toán" />;
  }

  if (items.length === 0) {
    return (
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div className="mx-auto max-w-lg px-5 text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-sand"><PackageCheck className="h-9 w-9 text-forest" /></div>
          <h1 className="mb-4 text-[clamp(1.875rem,8vw,2.5rem)] font-medium text-ink">Chưa có sản phẩm để thanh toán</h1>
          <p className="mb-8 text-body">Bạn cần thêm ít nhất một sản phẩm vào giỏ hàng trước khi tiếp tục.</p>
          <Link href="/san-pham" className="inline-flex h-[52px] items-center rounded-full bg-forest px-7 font-semibold text-white">Chọn sản phẩm</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
      <div className="mx-auto" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
        <Link href="/gio-hang" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-forest transition-all hover:gap-3">
          <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
        </Link>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Bước cuối cùng</p>
            <h1 className="text-[clamp(2rem,8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink">Thông tin thanh toán</h1>
          </div>
          <div className="hidden items-center gap-2 text-[13px] text-muted sm:flex"><LockKeyhole className="h-4 w-4 text-forest" /> Không thu thập dữ liệu thẻ</div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form id="checkout-form" className="flex flex-col gap-6 lg:col-span-2" onSubmit={submitOrder}>
            <section className="rounded-2xl bg-paper p-6 md:p-8" aria-labelledby="shipping-heading">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[13px] font-bold text-white">1</span>
                <h2 id="shipping-heading" className="text-[19px] font-semibold text-ink">Thông tin giao hàng</h2>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Họ và tên *
                    <input type="text" autoComplete="name" required minLength={2} maxLength={80} value={form.name} onChange={(event) => updateField("name", event.target.value)} className={fieldClassName} />
                  </label>
                  <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Số điện thoại *
                    <input type="tel" autoComplete="tel" required minLength={8} maxLength={20} pattern="[0-9+() .-]{8,20}" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className={fieldClassName} />
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Email nhận xác nhận *
                  <input type="email" autoComplete="email" required maxLength={120} value={form.email} onChange={(event) => updateField("email", event.target.value)} className={fieldClassName} />
                  <span className="text-[12px] font-normal text-muted">Thông tin đơn hàng sẽ được gửi tới địa chỉ này.</span>
                </label>
                <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Địa chỉ giao hàng *
                  <input type="text" autoComplete="street-address" required minLength={5} maxLength={180} value={form.address} onChange={(event) => updateField("address", event.target.value)} className={fieldClassName} />
                </label>
                <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Tỉnh / Thành phố *
                  <input type="text" autoComplete="address-level1" required minLength={2} maxLength={80} value={form.city} onChange={(event) => updateField("city", event.target.value)} className={fieldClassName} />
                </label>
                <label className="flex flex-col gap-2 text-[15px] font-medium text-ink">Ghi chú
                  <textarea rows={3} maxLength={500} value={form.note} onChange={(event) => updateField("note", event.target.value)} className="resize-none rounded-[12px] border border-border bg-cream px-4 py-3 text-base leading-[1.65] text-body outline-none focus:border-forest focus:ring-2 focus:ring-forest/20" placeholder="Thời gian nhận hàng hoặc lời nhắn cho người giao" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-paper p-6 md:p-8" aria-labelledby="payment-heading">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[13px] font-bold text-white">2</span>
                <h2 id="payment-heading" className="text-[19px] font-semibold text-ink">Phương thức thanh toán</h2>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { value: "cod" as const, icon: WalletCards, label: "Thanh toán khi nhận hàng (COD)", description: "Thanh toán tiền mặt hoặc chuyển khoản cho người giao hàng." },
                  { value: "bank" as const, icon: Building2, label: "Chuyển khoản ngân hàng", description: "An Vị sẽ liên hệ và gửi thông tin chuyển khoản sau khi nhận đơn." },
                ].map((option) => (
                  <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-4 transition-colors ${paymentMethod === option.value ? "border-forest bg-forest/5" : "border-border hover:border-sage"}`}>
                    <input type="radio" name="payment" value={option.value} checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} className="mt-1 h-5 w-5 accent-forest" />
                    <option.icon className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <span className="flex-1"><span className="block text-[15px] font-semibold text-ink">{option.label}</span><span className="mt-1 block text-[13px] leading-5 text-muted">{option.description}</span></span>
                    {paymentMethod === option.value ? <Check className="h-5 w-5 text-forest" /> : null}
                  </label>
                ))}
              </div>
            </section>

            {error ? <div role="alert" className="rounded-[12px] border border-error/20 bg-error/10 px-4 py-3 text-[14px] text-error">{error}</div> : null}
            <button type="submit" disabled={submitting} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-forest font-semibold text-white transition-colors hover:bg-forest-hover disabled:cursor-wait disabled:opacity-70 lg:hidden">
              {submitting ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Đang xử lý đơn hàng…</> : `Hoàn tất đặt hàng · ${formatPrice(totals.total)}`}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-paper p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <h2 className="mb-5 text-[18px] font-semibold text-ink">Đơn hàng của bạn</h2>
            <div className="mb-5 flex max-h-72 flex-col gap-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[9px] bg-sand"><Image src={item.image} alt="" fill sizes="56px" className="object-cover" /><span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[10px] font-bold text-white">{item.quantity}</span></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{item.name}</p><p className="text-[12px] text-muted">{item.weight}</p></div>
                  <p className="text-[14px] font-medium text-ink">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-y border-border py-4 text-[15px]">
              <div className="flex justify-between"><span className="text-body">Tạm tính</span><span className="font-medium text-ink">{formatPrice(totals.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-body">Vận chuyển</span><span className={totals.shippingFee === 0 ? "font-medium text-forest" : "text-ink"}>{totals.shippingFee === 0 ? "Miễn phí" : formatPrice(totals.shippingFee)}</span></div>
            </div>
            <div className="my-5 flex justify-between text-[18px] font-bold"><span className="text-ink">Tổng cộng</span><span className="text-ink">{formatPrice(totals.total)}</span></div>
            <button type="submit" form="checkout-form" disabled={submitting} className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest font-semibold text-white transition-colors hover:bg-forest-hover disabled:cursor-wait disabled:opacity-70 lg:flex">
              {submitting ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Đang xử lý…</> : "Hoàn tất đặt hàng"}
            </button>
            <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[12px] leading-5 text-muted"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Bằng việc đặt hàng, bạn đồng ý với chính sách mua hàng.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
