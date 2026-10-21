"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useShop } from "@/components/commerce/ShopProvider";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import type { Product } from "@/lib/products";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cau-chuyen", label: "Câu chuyện" },
  { href: "/tu-nong-trai", label: "Từ nông trại" },
  { href: "/goc-song-lanh", label: "Góc sống lành" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header({ products = [] }: { products?: Product[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, hydrated, openCart } = useShop();

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header data-site-header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border/60">
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            height: "var(--header-height)",
            width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))",
          }}
        >
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              className="group flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-forest hover:text-white hover:shadow-md active:scale-90 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-forest">
                <path
                  d="M14 3C14 3 6 7 6 15c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-12-8-12z"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M14 3C14 3 6 7 6 15c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-12-8-12z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M14 23V11M14 11C12 13 10 14 8 14.5M14 11c2 2 4 3 6 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-ink text-lg font-semibold tracking-tight uppercase"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
              >
                An Vị
              </span>
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body hover:text-ink transition-colors text-[15px] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm sản phẩm"
              className="group flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-forest hover:text-white hover:shadow-md active:scale-90"
            >
              <Search className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label="Giỏ hàng"
              aria-haspopup="dialog"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-forest hover:text-white hover:shadow-md active:scale-90"
            >
              <ShoppingBag className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
              <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-cream transition-transform duration-300 group-hover:scale-110 group-hover:bg-wheat">
                {hydrated ? Math.min(cartCount, 99) : 0}
              </span>
            </button>

            <ButtonLink
              href="/san-pham"
              size="sm"
              withArrow
              className="hidden lg:inline-flex ml-2"
            >
              Mua ngay
            </ButtonLink>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 top-[var(--header-height)] z-40">
            <div
              className="absolute inset-0 bg-ink/20"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="relative bg-cream w-full max-w-sm ml-0 h-full shadow-xl overflow-y-auto">
              <div className="flex flex-col p-6 gap-1">
                {/* Mobile search bar */}
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                  className="mb-4 flex items-center gap-3 rounded-full bg-paper px-4 py-3 text-[15px] text-muted ring-1 ring-border/60"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  Tìm sản phẩm...
                </button>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-ink text-[17px] font-medium py-3.5 border-b border-border/40 flex items-center justify-between"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}

                <ButtonLink
                  href="/san-pham"
                  size="lg"
                  withArrow
                  className="mt-6 w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Mua ngay
                </ButtonLink>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} products={products} />
    </>
  );
}
