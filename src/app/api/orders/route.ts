import { calculateOrder, resolveCart, type CheckoutCustomer, type Order, type PaymentMethod } from "@/lib/commerce";
import { sendOrderEmails } from "@/lib/email";
import { getStoreProducts, reserveOrder, updateOrderEmailStatus } from "@/lib/admin-store";
import { anonymizeRateLimitKey, getClientAddress, noStoreJson, takeRateLimit, verifyJsonRequest, verifySameOrigin } from "@/lib/request-security";

interface OrderRequest {
  customer?: Partial<CheckoutCustomer>;
  paymentMethod?: PaymentMethod;
  cart?: { productId: number; quantity: number }[];
  idempotencyKey?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s.-]{8,20}$/;

function isValidText(value: unknown, min: number, max: number): value is string {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 32_768);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  if (!verifySameOrigin(request)) return noStoreJson({ message: "Nguồn yêu cầu không hợp lệ." }, { status: 403 });
  const ipLimit = takeRateLimit(anonymizeRateLimitKey(`order-ip:${getClientAddress(request)}`), 12, 10 * 60 * 1000);
  if (!ipLimit.allowed) return noStoreJson({ message: "Bạn thao tác quá nhanh. Vui lòng thử lại sau." }, { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } });

  let body: OrderRequest;
  try {
    const parsed = (await request.json()) as unknown;
    if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid payload");
    body = parsed as OrderRequest;
  } catch {
    return noStoreJson({ message: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  if (typeof body.idempotencyKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(body.idempotencyKey)) {
    return noStoreJson({ message: "Phiên đặt hàng không hợp lệ. Vui lòng tải lại trang." }, { status: 422 });
  }

  const customer = body.customer;
  if (
    !customer ||
    !isValidText(customer.name, 2, 80) ||
    !isValidText(customer.phone, 8, 20) ||
    !PHONE_PATTERN.test(customer.phone) ||
    !isValidText(customer.email, 5, 120) ||
    !EMAIL_PATTERN.test(customer.email) ||
    !isValidText(customer.address, 5, 180) ||
    !isValidText(customer.city, 2, 80) ||
    (customer.note !== undefined && !isValidText(customer.note, 0, 500))
  ) {
    return noStoreJson({ message: "Vui lòng kiểm tra lại thông tin nhận hàng." }, { status: 422 });
  }

  const identityLimit = takeRateLimit(anonymizeRateLimitKey(`order-customer:${customer.email.trim().toLowerCase()}:${customer.phone.trim()}`), 5, 30 * 60 * 1000);
  if (!identityLimit.allowed) return noStoreJson({ message: "Đã có nhiều đơn được gửi từ thông tin này. Vui lòng thử lại sau." }, { status: 429, headers: { "Retry-After": String(identityLimit.retryAfter) } });

  if (body.paymentMethod !== "cod" && body.paymentMethod !== "bank") {
    return noStoreJson({ message: "Phương thức thanh toán không hợp lệ." }, { status: 422 });
  }

  if (
    !Array.isArray(body.cart) ||
    body.cart.length === 0 ||
    body.cart.length > 20 ||
    !body.cart.every(
      (line) =>
        typeof line === "object" &&
        line !== null &&
        Number.isInteger(line.productId) &&
        Number.isInteger(line.quantity) &&
        line.quantity >= 1 &&
        line.quantity <= 20,
    ) ||
    new Set(body.cart.map((line) => line.productId)).size !== body.cart.length
  ) {
    return noStoreJson({ message: "Giỏ hàng không có sản phẩm hợp lệ." }, { status: 422 });
  }

  const catalog = await getStoreProducts();
  const items = resolveCart(body.cart, catalog, false);
  if (items.length !== body.cart.length) {
    return noStoreJson({ message: "Một sản phẩm trong giỏ không còn hợp lệ." }, { status: 422 });
  }

  const totals = calculateOrder(items);
  const id = `HL${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim().toLowerCase(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      note: customer.note?.trim() ?? "",
    },
    paymentMethod: body.paymentMethod,
    paymentStatus: body.paymentMethod === "cod" ? "pay_on_delivery" : "awaiting_payment",
    status: "confirmed",
    items,
    ...totals,
    emailStatus: "not_configured",
  };

  let reservation;
  try {
    reservation = await reserveOrder(order, body.idempotencyKey);
  } catch (error) {
    if (error instanceof Error && error.message === "IDEMPOTENCY_CONFLICT") return noStoreJson({ message: "Phiên đặt hàng đã được sử dụng. Vui lòng tải lại trang." }, { status: 409 });
    return noStoreJson({ message: "Chưa thể ghi nhận đơn hàng. Vui lòng thử lại." }, { status: 503 });
  }
  if (reservation.created) {
    reservation.order.emailStatus = await sendOrderEmails(reservation.order);
    await updateOrderEmailStatus(reservation.order.id, reservation.order.emailStatus);
  }
  const safeOrder = { ...reservation.order };
  delete safeOrder.idempotencyKey;
  return noStoreJson({ order: safeOrder }, { status: reservation.created ? 201 : 200 });
}
