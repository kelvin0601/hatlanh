"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useShop } from "@/components/commerce/ShopProvider";
import { calculateOrder, FREE_SHIPPING_THRESHOLD, resolveCart } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { cart, hydrated, updateQuantity, removeFromCart, notify } = useShop();
  const items = resolveCart(cart);
  const totals = calculateOrder(items);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);

  if (!hydrated) {
    return (
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div className="mx-auto max-w-xl animate-pulse text-center" aria-label="Đang tải giỏ hàng">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-sand" />
          <div className="mx-auto mb-4 h-9 w-56 rounded-full bg-sand" />
          <div className="mx-auto h-5 w-80 max-w-full rounded-full bg-sand" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div className="mx-auto text-center" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sand">
              <ShoppingBag className="h-8 w-8 text-muted" />
            </div>
            <h1 className="mb-4 text-[clamp(1.875rem,8.5vw,2.25rem)] font-medium leading-[1.18] text-ink">Giỏ hàng đang trống</h1>
            <p className="mb-8 text-[17px] leading-[1.65] text-body">
              Hãy chọn một hương vị bạn yêu thích. Sản phẩm sẽ được giữ trong giỏ ngay cả khi bạn quay lại sau.
            </p>
            <Link href="/san-pham" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-forest px-7 text-base font-semibold text-white transition-colors hover:bg-forest-hover">
              Khám phá sản phẩm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
      <div className="mx-auto" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">Đơn hàng của bạn</p>
            <h1 className="text-[clamp(2rem,8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink">Giỏ hàng</h1>
          </div>
          <Link href="/san-pham" className="hidden text-[14px] font-semibold text-forest hover:underline sm:block">Tiếp tục mua sắm</Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <article key={item.productId} className="grid grid-cols-[88px_1fr] gap-4 rounded-[14px] bg-paper p-4 md:grid-cols-[112px_1fr_auto] md:items-center md:p-5">
                <Link href={`/san-pham/${item.slug}`} className="relative aspect-square overflow-hidden rounded-[10px] bg-sand">
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/san-pham/${item.slug}`}><h2 className="text-[16px] font-semibold leading-6 text-ink hover:text-forest">{item.name}</h2></Link>
                  <p className="mt-0.5 text-[13px] text-muted">{item.weight}</p>
                  <p className="mt-2 font-bold text-ink md:hidden">{formatPrice(item.price * item.quantity)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-sand" aria-label={`Giảm số lượng ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      <Minus className="h-4 w-4 text-ink" />
                    </button>
                    <span className="w-8 text-center font-medium text-ink" aria-label={`Số lượng ${item.quantity}`}>{item.quantity}</span>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Tăng số lượng ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= 20}>
                      <Plus className="h-4 w-4 text-ink" />
                    </button>
                    <button type="button" className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-[13px] text-error transition-colors hover:bg-error/10" aria-label={`Xóa ${item.name}`} onClick={() => { removeFromCart(item.productId); notify(`Đã xóa ${item.name} khỏi giỏ hàng.`); }}>
                      <Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Xóa</span>
                    </button>
                  </div>
                </div>
                <p className="hidden w-32 text-right text-[17px] font-bold text-ink md:block">{formatPrice(item.price * item.quantity)}</p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl bg-paper p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <h2 className="mb-5 text-[18px] font-semibold text-ink">Tóm tắt đơn hàng</h2>
            <div className="mb-5 rounded-[12px] bg-cream p-4">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-forest">
                <Truck className="h-4 w-4" />
                {amountUntilFreeShipping === 0 ? "Đơn hàng đã được miễn phí vận chuyển" : `Mua thêm ${formatPrice(amountUntilFreeShipping)} để được miễn phí giao hàng`}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-forest transition-[width]" style={{ width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4">
              <div className="flex justify-between text-[15px]"><span className="text-body">Tạm tính</span><span className="font-medium text-ink">{formatPrice(totals.subtotal)}</span></div>
              <div className="flex justify-between text-[15px]"><span className="text-body">Phí vận chuyển</span><span className={totals.shippingFee === 0 ? "font-medium text-forest" : "text-ink"}>{totals.shippingFee === 0 ? "Miễn phí" : formatPrice(totals.shippingFee)}</span></div>
            </div>
            <div className="mb-6 flex justify-between text-[18px] font-bold"><span className="text-ink">Tổng cộng</span><span className="text-ink">{formatPrice(totals.total)}</span></div>
            <Link href="/thanh-toan" className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-white transition-colors hover:bg-forest-hover">
              Tiến hành thanh toán <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-[12px] leading-5 text-muted">Giá đã bao gồm thuế. Thông tin của bạn được bảo mật.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
