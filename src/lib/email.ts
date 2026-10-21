import type { Order } from "@/lib/commerce";
import { formatPrice } from "@/lib/products";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { configured: false, sent: false };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL ?? "An Vị <orders@anvi.vn>",
      to,
      subject,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return { configured: true, sent: true };
}

function orderRows(order: Order) {
  return order.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e6e0d4;color:#213728">${escapeHtml(item.name)} × ${item.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #e6e0d4;text-align:right;color:#213728">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join("");
}

function customerOrderEmail(order: Order) {
  const paymentNote = order.paymentMethod === "bank"
    ? "Đơn hàng đang chờ chuyển khoản. An Vị sẽ liên hệ để gửi thông tin thanh toán và xác nhận giao hàng."
    : "Bạn sẽ thanh toán khi nhận hàng. An Vị sẽ liên hệ xác nhận trước khi giao.";

  return `
    <div style="margin:0;background:#f8f4ea;padding:32px 16px;font-family:Arial,sans-serif;color:#4d564b">
      <div style="max-width:600px;margin:0 auto;background:#fffcf6;border-radius:16px;padding:32px">
        <p style="margin:0 0 8px;color:#798b6c;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">An Vị</p>
        <h1 style="margin:0 0 16px;color:#213728;font-family:Georgia,serif;font-size:28px">Cảm ơn bạn đã đặt hàng</h1>
        <p>Xin chào ${escapeHtml(order.customer.name)}, đơn hàng <strong>${order.id}</strong> đã được tiếp nhận.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">${orderRows(order)}</table>
        <p style="margin:8px 0;text-align:right">Phí giao hàng: ${order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}</p>
        <p style="margin:8px 0 24px;text-align:right;color:#213728;font-size:18px"><strong>Tổng cộng: ${formatPrice(order.total)}</strong></p>
        <div style="border-radius:12px;background:#f8f4ea;padding:16px"><strong style="color:#213728">Bước tiếp theo</strong><br>${paymentNote}</div>
        <p style="margin:24px 0 0;font-size:13px;color:#697366">Giao đến: ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)} · ${escapeHtml(order.customer.phone)}</p>
      </div>
    </div>
  `;
}

function adminOrderEmail(order: Order) {
  return `
    <div style="font-family:Arial,sans-serif;color:#26342a">
      <h1>Đơn hàng mới ${order.id}</h1>
      <p><strong>Khách hàng:</strong> ${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.phone)} · ${escapeHtml(order.customer.email)}</p>
      <p><strong>Địa chỉ:</strong> ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)}</p>
      <table style="width:100%;border-collapse:collapse">${orderRows(order)}</table>
      <p><strong>Tổng cộng: ${formatPrice(order.total)}</strong></p>
    </div>
  `;
}

export async function sendOrderEmails(order: Order): Promise<Order["emailStatus"]> {
  if (!process.env.RESEND_API_KEY) return "not_configured";

  try {
    const recipients = [
      sendEmail([order.customer.email], `An Vị đã nhận đơn ${order.id}`, customerOrderEmail(order)),
    ];
    const storeEmail = process.env.STORE_NOTIFICATION_EMAIL;
    if (storeEmail) recipients.push(sendEmail([storeEmail], `Đơn hàng mới ${order.id}`, adminOrderEmail(order)));
    await Promise.all(recipients);
    return "sent";
  } catch (error) {
    console.error("Unable to send order email", error);
    return "failed";
  }
}

export async function sendContactEmail(input: { name: string; email: string; phone: string; message: string }) {
  const storeEmail = process.env.STORE_NOTIFICATION_EMAIL;
  if (!process.env.RESEND_API_KEY || !storeEmail) return "not_configured" as const;

  try {
    await sendEmail(
      [storeEmail],
      `Liên hệ mới từ ${input.name}`,
      `<div style="font-family:Arial,sans-serif;color:#26342a"><h1>Lời nhắn mới</h1><p><strong>Họ tên:</strong> ${escapeHtml(input.name)}</p><p><strong>Email:</strong> ${escapeHtml(input.email)}</p><p><strong>Điện thoại:</strong> ${escapeHtml(input.phone || "Không cung cấp")}</p><p><strong>Nội dung:</strong></p><p>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p></div>`,
    );
    return "sent" as const;
  } catch (error) {
    console.error("Unable to send contact email", error);
    return "failed" as const;
  }
}
