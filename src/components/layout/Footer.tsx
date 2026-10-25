"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const footerGroups = [
  {
    title: "Về An Vị",
    links: [
      { label: "Câu chuyện thương hiệu", href: "/cau-chuyen" },
      { label: "Từ nông trại", href: "/tu-nong-trai" },
      { label: "Cam kết chất lượng", href: "/cau-chuyen" },
    ],
  },
  {
    title: "Sản phẩm",
    links: [
      { label: "Tất cả sản phẩm", href: "/san-pham" },
      { label: "Ngũ cốc nguyên hạt", href: "/san-pham" },
      { label: "Ngũ cốc dinh dưỡng", href: "/san-pham" },
      { label: "Bột ngũ cốc", href: "/san-pham" },
      { label: "Combo · Quà tặng", href: "/san-pham" },
    ],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [
      { label: "Hướng dẫn mua hàng", href: "/chinh-sach/huong-dan-mua-hang" },
      { label: "Chính sách giao hàng", href: "/chinh-sach/giao-hang" },
      { label: "Chính sách đổi trả", href: "/chinh-sach/doi-tra" },
      { label: "Câu hỏi thường gặp", href: "/lien-he" },
    ],
  },
];

function FooterAccordion({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        className="w-full flex items-center justify-between py-4 md:hidden text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-white font-semibold text-[14px]">{title}</span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <h3 className="hidden md:block text-white font-semibold text-[14px] mb-4">{title}</h3>
      <ul className={`flex flex-col gap-2.5 pb-4 md:pb-0 ${open ? "block" : "hidden md:flex"}`}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="link-underline text-[13px] text-white/85 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white/85 transition-colors hover:border-white/70 hover:text-white">
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer data-site-footer className="bg-forest text-white">
      <div
        className="mx-auto py-12 md:py-16"
        style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
      >
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand column */}
          <div className="mb-4 md:mb-0">
            <Link href="/" aria-label="An Vị - Trang chủ" className="mb-3 inline-flex">
              <BrandLogo variant="footer" className="h-14 w-auto" />
            </Link>
            <p className="mb-5 text-[13px] leading-relaxed text-white/80">
              An vị mỗi ngày, dưỡng thân tâm.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <SocialIcon label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </SocialIcon>
              <SocialIcon label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
              </SocialIcon>
              <SocialIcon label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.17V11.7a4.83 4.83 0 01-3.55-1.46V6.69h3.55z"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Navigation columns */}
          {footerGroups.map((group) => (
            <FooterAccordion key={group.title} title={group.title} links={group.links} />
          ))}
        </div>

        {/* Contact info - inline with last column on desktop */}
        <div className="md:hidden mt-8 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[13px] text-white/85">
            <Phone className="w-4 h-4" /> 028 7300 0888
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-white/85">
            <Mail className="w-4 h-4" /> info@anvi.vn
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-white/85">
            <MapPin className="w-4 h-4" /> Số 123, Xã..., Huyện..., Việt Nam
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] md:flex-row">
          <p className="text-white/40">&copy; 2026 An Vị. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/chinh-sach/dieu-khoan-su-dung" className="link-underline text-white/80 transition-colors hover:text-white">Điều khoản sử dụng</Link>
            <Link href="/chinh-sach/bao-mat" className="link-underline text-white/80 transition-colors hover:text-white">Chính sách bảo mật</Link>
            <Link href="/sitemap.xml" className="link-underline text-white/80 transition-colors hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
