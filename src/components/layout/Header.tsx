"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { getCategoryHref, type ProductCategoryDefinition } from "@/lib/product-categories";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useShop } from "@/components/commerce/ShopProvider";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Product } from "@/lib/products";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cau-chuyen", label: "Câu chuyện" },
  { href: "/tu-nong-trai", label: "Từ nông trại" },
  { href: "/goc-song-lanh", label: "Góc sống lành" },
  { href: "/lien-he", label: "Liên hệ" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ products = [], categories = [] }: { products?: Product[]; categories?: ProductCategoryDefinition[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, hydrated, openCart } = useShop();
  const pathname = usePathname();

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
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="An Vị - Trang chủ" className="shrink-0">
              <BrandLogo priority className="h-9 w-auto sm:h-10" />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              const ariaCurrent = pathname === link.href ? "page" : active ? "true" : undefined;
              const linkClass = `link-underline text-[15px] font-medium transition-colors ${active ? "text-ink" : "text-body hover:text-ink"}`;
              if (link.href !== "/san-pham") {
                return (
                  <Link key={link.href} href={link.href} aria-current={ariaCurrent} className={linkClass}>
                    {link.label}
                  </Link>
                );
              }
              return (
                <div key={link.href} className="group/nav relative">
                  <Link
                    href={link.href}
                    aria-current={ariaCurrent}
                    className={`${linkClass} inline-flex items-center gap-1`}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180" aria-hidden="true" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-[opacity,translate,visibility] duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    <ul className="w-60 rounded-[14px] bg-paper p-2 shadow-[0_12px_36px_rgba(33,55,40,0.12)] ring-1 ring-border/40">
                      {categories.map((category) => {
                        const href = getCategoryHref(category.value);
                        const current = pathname === href;
                        return (
                          <li key={category.value}>
                            <Link
                              href={href}
                              aria-current={current ? "page" : undefined}
                              className={`block rounded-[10px] px-3 py-2.5 text-[14px] font-semibold transition-colors ${current ? "bg-forest/[0.06] text-forest" : "text-ink hover:bg-sand/50"}`}
                            >
                              {category.label}
                            </Link>
                          </li>
                        );
                      })}
                      <li className="mt-1 border-t border-border/50 pt-1">
                        <Link href="/san-pham" className="flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[14px] font-semibold text-forest transition-colors hover:bg-sand/50">
                          Tất cả sản phẩm
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm sản phẩm"
              className="group flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:bg-forest hover:text-white hover:shadow-md active:scale-90"
            >
              <Search className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label="Giỏ hàng"
              aria-haspopup="dialog"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:bg-forest hover:text-white hover:shadow-md active:scale-90"
            >
              <ShoppingBag className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
              <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-cream transition-transform duration-300 group-hover:scale-110 group-hover:bg-wheat">
                {hydrated ? Math.min(cartCount, 99) : 0}
              </span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="group flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[color,background-color,transform,box-shadow] duration-300 hover:bg-forest hover:text-white hover:shadow-md active:scale-90 lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? (
                <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            <div className="ml-2 hidden lg:block">
              <ButtonLink href="/san-pham" size="sm" withArrow>
                Mua ngay
              </ButtonLink>
            </div>
          </div>
        </div>

      </header>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 transition-[visibility] duration-300 lg:hidden ${menuOpen ? "visible" : "invisible pointer-events-none delay-300"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        aria-hidden={!menuOpen}
      >
          <button
            type="button"
            className={`absolute inset-0 bg-ink/25 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMenuOpen(false)}
            aria-label="Đóng menu"
          />
          <nav className={`relative ml-auto h-full w-[min(88vw,360px)] overflow-y-auto bg-cream shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex flex-col gap-1 p-6">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                className="mb-4 flex items-center gap-3 rounded-full bg-paper px-4 py-3 text-[15px] text-muted ring-1 ring-border/60"
              >
                <Search className="h-4 w-4 shrink-0" />
                Tìm sản phẩm...
              </button>

              {navLinks.map((link) => (
                <Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between border-b border-border/40 py-3.5 text-[17px] font-medium text-ink"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {link.href === "/san-pham" && (
                    <ul className="flex flex-col border-b border-border/40 py-2 pl-4">
                      {categories.map((category) => (
                        <li key={category.value}>
                          <Link href={getCategoryHref(category.value)} className="block py-2.5 text-[15px] text-body" onClick={() => setMenuOpen(false)}>
                            {category.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Fragment>
              ))}

              <ButtonLink href="/san-pham" size="lg" withArrow className="mt-6 w-full" onClick={() => setMenuOpen(false)}>
                Mua ngay
              </ButtonLink>
            </div>
          </nav>
        </div>

      <SearchOverlay open={searchOpen} onClose={closeSearch} products={products} />
    </>
  );
}
