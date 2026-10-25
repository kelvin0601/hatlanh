import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { getSitePageContent } from "@/lib/site-content-store";

export default async function ContactPage() {
  const content = await getSitePageContent("contact");
  return (
    <section className="bg-cream" style={{ paddingBlock: "var(--hero-space)" }}>
      <div className="mx-auto" style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}>
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <h1 className="mb-4 font-medium leading-[1.12] tracking-[-0.035em] text-ink" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}>{content.heroTitle}</h1>
          <p className="text-[17px] leading-[1.65] text-body">{content.heroBody}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-2"><ContactForm /></div>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-paper p-6">
              <h2 className="mb-5 text-[17px] font-semibold text-ink" style={{ fontFamily: "var(--font-display)" }}>Thông tin liên hệ</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 text-forest" /><div><p className="text-[15px] font-medium text-ink">Hotline</p><a href={`tel:${content.phone.replace(/\s/g, "")}`} className="text-[15px] text-body hover:text-forest">{content.phone}</a></div></div>
                <div className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 text-forest" /><div><p className="text-[15px] font-medium text-ink">Email</p><a href={`mailto:${content.email}`} className="text-[15px] text-body hover:text-forest">{content.email}</a></div></div>
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-forest" /><div><p className="text-[15px] font-medium text-ink">Địa chỉ</p><p className="text-[15px] text-body">{content.address}</p></div></div>
              </div>
            </div>
            <div className="rounded-2xl bg-paper p-6"><h2 className="mb-3 text-[17px] font-semibold text-ink" style={{ fontFamily: "var(--font-display)" }}>{content.cooperationTitle}</h2><p className="text-[15px] leading-[1.65] text-body">{content.cooperationBody}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
