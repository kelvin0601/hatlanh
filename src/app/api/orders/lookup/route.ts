import { findOrderForCustomer } from "@/lib/admin-store";
import type { OrderTrackingDto } from "@/lib/commerce";
import { anonymizeRateLimitKey, getClientAddress, noStoreJson, takeRateLimit, verifyJsonRequest, verifySameOrigin } from "@/lib/request-security";

const ORDER_ID_PATTERN = /^HL\d{6}-[A-Z0-9]{6}$/;
const PHONE_PATTERN = /^[0-9+()\s.-]{8,20}$/;

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 4_096);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  if (!verifySameOrigin(request)) return noStoreJson({ message: "Nguồn yêu cầu không hợp lệ." }, { status: 403 });
  const rateLimit = takeRateLimit(anonymizeRateLimitKey(`order-lookup:${getClientAddress(request)}`), 10, 10 * 60 * 1000);
  if (!rateLimit.allowed) return noStoreJson({ message: "Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });

  let body: { orderId?: unknown; phone?: unknown };
  try { body = (await request.json()) as typeof body; } catch { return noStoreJson({ message: "Dữ liệu tra cứu không hợp lệ." }, { status: 400 }); }
  const orderId = typeof body.orderId === "string" ? body.orderId.trim().toUpperCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!ORDER_ID_PATTERN.test(orderId) || !PHONE_PATTERN.test(phone)) return noStoreJson({ message: "Mã đơn hàng hoặc số điện thoại không hợp lệ." }, { status: 422 });

  const order = await findOrderForCustomer(orderId, phone);
  if (!order) return noStoreJson({ message: "Không tìm thấy đơn hàng phù hợp." }, { status: 404 });
  const safeOrder: OrderTrackingDto = {
    id: order.id,
    createdAt: order.createdAt,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    items: order.items,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
  };
  return noStoreJson({ order: safeOrder });
}
