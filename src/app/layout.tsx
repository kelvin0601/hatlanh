import type { Metadata } from "next";
import { Lora, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ShopProvider } from "@/components/commerce/ShopProvider";
import { CartDrawer } from "@/components/commerce/CartDrawer";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "An Vị — Ngũ cốc thiên nhiên",
    template: "%s | An Vị — Ngũ cốc thiên nhiên",
  },
  description:
    "An vị mỗi ngày, dưỡng thân tâm. Ngũ cốc thiên nhiên từ vùng quê Việt Nam.",
  keywords: ["ngũ cốc", "an vị", "organic", "thiên nhiên", "hạt ngũ cốc", "bữa sáng", "dinh dưỡng"],
  metadataBase: new URL("https://anvi.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "An Vị",
    title: "An Vị — Ngũ cốc thiên nhiên",
    description: "An vị mỗi ngày, dưỡng thân tâm. Ngũ cốc thiên nhiên từ vùng quê Việt Nam.",
  },
  twitter: {
    card: "summary_large_image",
    title: "An Vị — Ngũ cốc thiên nhiên",
    description: "An vị mỗi ngày, dưỡng thân tâm. Ngũ cốc thiên nhiên từ vùng quê Việt Nam.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${lora.variable} ${beVietnamPro.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <ShopProvider>
          <a href="#main-content" className="fixed left-3 top-3 z-[120] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white focus:translate-y-0">Bỏ qua điều hướng</a>
          <SiteHeader />
          <CartDrawer />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
