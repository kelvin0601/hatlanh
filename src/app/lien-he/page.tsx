"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  return (
    <>
      <section className="bg-cream" style={{ paddingBlock: "var(--section-space)" }}>
        <div
          className="mx-auto"
          style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
        >
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <h1
              className="text-ink leading-[1.12] tracking-[-0.035em] font-medium mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.375rem, 11.3vw, 3rem)" }}
            >
              Liên hệ với Hạt Lành
            </h1>
            <p className="text-body text-[17px] leading-[1.65]">
              Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Hãy gửi lời nhắn, chúng tôi sẽ phản hồi sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <form
                className="bg-paper rounded-2xl p-6 md:p-8 flex flex-col gap-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-ink font-medium text-[15px]">Họ và tên</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-ink font-medium text-[15px]">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-ink font-medium text-[15px]">Số điện thoại</label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-[52px] px-4 rounded-[12px] border border-border bg-cream text-body text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-ink font-medium text-[15px]">Lời nhắn</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="px-4 py-3 rounded-[12px] border border-border bg-cream text-body text-base leading-[1.65] resize-none focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-hover text-white font-semibold text-base h-[52px] px-7 rounded-full transition-colors w-full sm:w-fit"
                >
                  Gửi lời nhắn
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-paper rounded-2xl p-6">
                <h2 className="text-ink font-semibold text-[17px] mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Thông tin liên hệ
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-forest mt-0.5" />
                    <div>
                      <p className="text-ink font-medium text-[15px]">Hotline</p>
                      <p className="text-body text-[15px]">0123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-forest mt-0.5" />
                    <div>
                      <p className="text-ink font-medium text-[15px]">Email</p>
                      <p className="text-body text-[15px]">hello@hatlanh.vn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-forest mt-0.5" />
                    <div>
                      <p className="text-ink font-medium text-[15px]">Địa chỉ</p>
                      <p className="text-body text-[15px]">TP. Hồ Chí Minh, Việt Nam</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-paper rounded-2xl p-6">
                <h2 className="text-ink font-semibold text-[17px] mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Hợp tác và phân phối
                </h2>
                <p className="text-body text-[15px] leading-[1.65]">
                  Bạn muốn phân phối sản phẩm Hạt Lành? Liên hệ qua email hoặc gửi lời nhắn, chúng tôi sẽ trao đổi chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
