"use client";

import { ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useShop } from "@/components/commerce/ShopProvider";
import type { Product } from "@/lib/products";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  compact?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  className,
}: AddToCartButtonProps) {
  const { addToCart, notify, openCart } = useShop();

  return (
    <button
      type="button"
      className={clsx(
        "group/cart inline-flex items-center justify-center gap-2 rounded-full bg-forest font-semibold text-white shadow-[0_6px_16px_rgba(33,55,40,0.18)] transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-forest-hover hover:shadow-[0_10px_24px_rgba(33,55,40,0.25)] active:translate-y-0 active:scale-[0.97]",
        compact ? "h-11 w-11" : "h-[52px] px-6 text-[15px]",
        className,
      )}
      onClick={() => {
        addToCart(product, quantity);
        notify(`Đã thêm ${product.shortName} vào giỏ hàng.`);
        openCart();
      }}
      aria-label={`Thêm ${product.name} vào giỏ hàng`}
    >
      <ShoppingBag className="h-4 w-4 transition-transform group-hover/cart:-rotate-6 group-hover/cart:scale-110" />
      {compact ? null : <span>Thêm vào giỏ</span>}
    </button>
  );
}
