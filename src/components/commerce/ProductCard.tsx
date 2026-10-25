import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] bg-paper transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
      <Link href={`/san-pham/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[12px] font-semibold text-forest shadow-sm backdrop-blur-sm">
          Thuần tự nhiên
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-2 flex items-center gap-1.5 text-[12px] text-muted">
          <div className="flex" aria-label="Được đánh giá 4.8 trên 5 sao">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-3 w-3 fill-wheat text-wheat" aria-hidden="true" />
            ))}
          </div>
          <span>4.8</span>
          <span aria-hidden="true">·</span>
          <span>{product.weight}</span>
        </div>

        <Link href={`/san-pham/${product.slug}`}>
          <h2 className="text-[18px] font-semibold leading-[1.35] text-ink transition-colors group-hover:text-forest">
            {product.name}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-muted">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            <p className="text-[12px] text-muted">Giá bán</p>
            <p className="text-[19px] font-bold leading-6 text-ink">{formatPrice(product.price)}</p>
          </div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
