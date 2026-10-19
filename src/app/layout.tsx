import type { Metadata } from "next";
import { Lora, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    default: "Hạt Lành — Ngũ cốc thiên nhiên",
    template: "%s | Hạt Lành",
  },
  description:
    "Gieo hạt lành, dưỡng thân tâm. Ngũ cốc hạt thiên nhiên từ vùng quê Việt Nam.",
  keywords: ["ngũ cốc", "hạt lành", "organic", "thiên nhiên", "hạt ngũ cốc", "bữa sáng", "dinh dưỡng"],
  metadataBase: new URL("https://hatlanh.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Lành",
    title: "Hạt Lành — Ngũ cốc thiên nhiên",
    description: "Gieo hạt lành, dưỡng thân tâm. Ngũ cốc thiên nhiên từ vùng quê Việt Nam.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hạt Lành — Ngũ cốc thiên nhiên",
    description: "Gieo hạt lành, dưỡng thân tâm. Ngũ cốc thiên nhiên từ vùng quê Việt Nam.",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
