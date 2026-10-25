"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useShop } from "@/components/commerce/ShopProvider";
import { getComboRecommendations } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

export function ComboRecommendations({ compact = false, limit = 2 }: { compact?: boolean; limit?: number }) {
  const { cart, catalog, upgradeToCombo } = useShop();
  const recommendations = useMemo(
    () => getComboRecommendations(cart, catalog).slice(0, limit),
    [cart, catalog, limit],
  );

  if (recommendations.length === 0) return null;

  return (
    <section className={compact ? "mt-4 border-t border-border pt-4" : "mb-5 border-t border-border pt-5"} aria-labelledby={compact ? "cart-combo-heading" : "checkout-combo-heading"}>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-[#a66325]"><Sparkles className="h-3.5 w-3.5" /></span>
        <div>
          <h3 id={compact ? "cart-combo-heading" : "checkout-combo-heading"} className="text-[14px] font-bold text-ink">Mua combo tiết kiệm hơn</h3>
          <p className="text-[11px] text-muted">Đổi sản phẩm đã chọn sang ưu đãi phù hợp.</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {recommendations.map(({ combo, regularTotal, savings, components }) => (
          <article key={combo.id} className="rounded-[12px] border border-[#d7c9ad] bg-[#fffaf0] p-2.5">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[9px] bg-sand">
                <Image src={combo.image} alt={combo.imageAlt} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-2 text-[13px] font-bold leading-5 text-ink">{combo.name}</h4>
                  <span className="shrink-0 rounded-full bg-[#e8f0df] px-2 py-1 text-[10px] font-bold text-forest">-{formatPrice(savings)}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{components.map(({ product, quantity }) => `${quantity}× ${product.shortName}`).join(" + ")}</p>
                <div className="mt-1.5 flex items-baseline gap-2"><span className="text-[14px] font-bold text-forest">{formatPrice(combo.price)}</span><span className="text-[11px] text-muted line-through">{formatPrice(regularTotal)}</span></div>
              </div>
            </div>
            <button type="button" onClick={() => upgradeToCombo(combo)} className="mt-2.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-forest px-4 text-[12px] font-semibold text-white transition-colors hover:bg-forest-hover">
              Đổi sang combo <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
