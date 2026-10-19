"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cau-chuyen", label: "Câu chuyện" },
  { href: "/tu-nong-trai", label: "Từ nông trại" },
  { href: "/goc-song-lanh", label: "Góc sống lành" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border/60">
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
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand/60 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-ink" />
            ) : (
              <Menu className="w-5 h-5 text-ink" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            {/* Leaf icon as logo mark */}
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
              Hạt Lành
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
            aria-label="Tìm kiếm"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand/60 transition-colors"
          >
            <Search className="w-[18px] h-[18px] text-ink" />
          </button>

          <button
            aria-label="Tài khoản"
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-sand/60 transition-colors"
          >
            <User className="w-[18px] h-[18px] text-ink" />
          </button>

          <button
            aria-label="Giỏ hàng"
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-sand/60 transition-colors"
          >
            <ShoppingBag className="w-[18px] h-[18px] text-ink" />
            <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          <Link
            href="/san-pham"
            className="hidden lg:inline-flex items-center justify-center gap-1.5 bg-forest hover:bg-forest-hover text-white font-semibold text-[13px] h-9 px-5 rounded-full transition-colors ml-2"
          >
            Mua ngay
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-0.5">
              <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
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

              <Link
                href="/san-pham"
                className="mt-6 flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] rounded-full transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Mua ngay
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
