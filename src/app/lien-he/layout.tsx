import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Hạt Lành để được tư vấn sản phẩm, hợp tác phân phối hoặc gửi góp ý cho chúng tôi.",
  keywords: ["liên hệ Hạt Lành", "tư vấn ngũ cốc", "phân phối ngũ cốc"],
  openGraph: {
    title: "Liên hệ | Hạt Lành — Ngũ cốc thiên nhiên",
    description: "Gửi lời nhắn cho Hạt Lành để được tư vấn và hỗ trợ.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên hệ | Hạt Lành — Ngũ cốc thiên nhiên",
    description: "Gửi lời nhắn cho Hạt Lành để được tư vấn và hỗ trợ.",
  },
};

export default function ContactLayout({ children }: LayoutProps<"/lien-he">) {
  return children;
}
