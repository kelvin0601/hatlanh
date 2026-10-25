"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop } from "@/components/commerce/ShopProvider";
import { ComboRecommendations } from "@/components/commerce/ComboRecommendations";
import { calculateOrder, resolveCart } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function CartDrawer() {
  const { cart, catalog, cartCount, cartOpen, closeCart, updateQuantity, removeFromCart } = useShop();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const items = resolveCart(cart, catalog);
  const totals = calculateOrder(items);

  useEffect(() => {
    if (!cartOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [cartOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[90] ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
        aria-label="Đóng giỏ hàng"
        tabIndex={cartOpen ? 0 : -1}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        data-open={cartOpen}
        className="cart-drawer-shell absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col overscroll-contain bg-paper shadow-[-18px_0_60px_rgba(33,55,40,0.18)]"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <header className="flex min-h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest/10 text-forest"><ShoppingBag className="h-4.5 w-4.5" aria-hidden="true" /></span>
            <div><h2 id="cart-drawer-title" className="text-[18px] font-semibold leading-6 text-ink">Giỏ hàng</h2><p className="text-[12px] text-muted">{cartCount} sản phẩm đã chọn</p></div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={closeCart} className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-sand" aria-label="Đóng giỏ hàng"><X className="h-5 w-5" /></button>
        </header>

        <div className="t-panel-slide flex min-h-0 flex-1 flex-col" data-open={cartOpen} style={{ "--panel-translate-y": "28px" } as React.CSSProperties}>
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-sand"><ShoppingBag className="h-8 w-8 text-muted" /></div>
              <h3 className="mb-2 text-xl font-semibold text-ink">Giỏ hàng đang trống</h3>
              <p className="mb-6 max-w-xs text-[14px] leading-6 text-muted">Chọn một hương vị lành mạnh để bắt đầu đơn hàng của bạn.</p>
              <Link href="/san-pham" onClick={closeCart} className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 font-semibold text-white hover:bg-forest-hover">Xem sản phẩm</Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
                {items.map((item) => (
                  <article key={item.productId} className="grid grid-cols-[76px_1fr] gap-3 border-b border-border py-4">
                    <Link href={`/san-pham/${item.slug}`} onClick={closeCart} className="relative aspect-square overflow-hidden rounded-[10px] bg-sand"><Image src={item.image} alt={item.name} fill sizes="76px" className="object-cover" /></Link>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0"><Link href={`/san-pham/${item.slug}`} onClick={closeCart} className="line-clamp-2 text-[14px] font-semibold leading-5 text-ink hover:text-forest">{item.name}</Link><p className="text-[12px] text-muted">{item.weight}</p></div>
                        <button type="button" onClick={() => removeFromCart(item.productId)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-error/10 hover:text-error" aria-label={`Xóa ${item.name}`}><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-border bg-cream">
                          <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand" aria-label={`Giảm số lượng ${item.name}`}><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-7 text-center text-[13px] font-semibold tabular-nums text-ink">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= 20} className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand disabled:opacity-40" aria-label={`Tăng số lượng ${item.name}`}><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-[14px] font-bold tabular-nums text-ink">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </article>
                ))}
                <ComboRecommendations compact />
              </div>

              <footer className="border-t border-border bg-cream/70 px-4 py-4 sm:px-6">
                <div className="mb-1 flex items-center justify-between text-[14px]"><span className="text-muted">Tạm tính</span><span className="font-medium tabular-nums text-ink">{formatPrice(totals.subtotal)}</span></div>
                <div className="mb-4 flex items-center justify-between text-[18px] font-bold"><span className="text-ink">Tổng cộng</span><span className="tabular-nums text-ink">{formatPrice(totals.total)}</span></div>
                <Link href="/thanh-toan" onClick={closeCart} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-forest px-6 font-semibold text-white hover:bg-forest-hover">Thanh toán <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/gio-hang" onClick={closeCart} className="mt-2 flex min-h-11 items-center justify-center text-[14px] font-semibold text-forest hover:underline">Xem giỏ hàng đầy đủ</Link>
              </footer>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
