import { getProductBySlug, products, type Product } from "@/lib/products";

export const FREE_SHIPPING_THRESHOLD = 300_000;
export const SHIPPING_FEE = 20_000;

export interface CartLine {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface CheckoutCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note: string;
}

export type PaymentMethod = "cod" | "bank";
export type PaymentStatus = "pending" | "awaiting_payment" | "pay_on_delivery" | "paid" | "failed" | "refunded";
export type OrderStatus = "confirmed" | "processing" | "shipping" | "completed" | "cancelled";

export interface OrderItem {
  productId: number;
  slug: string;
  name: string;
  weight: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  emailStatus: "sent" | "not_configured" | "failed";
  idempotencyKey?: string;
}

export type OrderTrackingDto = Pick<Order, "id" | "createdAt" | "paymentMethod" | "paymentStatus" | "status" | "items" | "subtotal" | "shippingFee" | "total">;

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}

export function resolveCart(lines: CartLine[], catalog: Product[] = products, allowSnapshot = true): OrderItem[] {
  return lines.flatMap((line) => {
    const product = catalog.find((item) => item.id === line.productId) ?? (allowSnapshot ? line.product : undefined);
    if (!product || !Number.isInteger(line.quantity) || line.quantity < 1) return [];

    return [{
      productId: product.id,
      slug: product.slug,
      name: product.name,
      weight: product.weight,
      image: product.image,
      price: product.price,
      quantity: Math.min(line.quantity, 20),
    }];
  });
}

export function calculateOrder(items: OrderItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}

export function getPaymentLabel(method: PaymentMethod) {
  return method === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng";
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    pending: "Đang xử lý",
    awaiting_payment: "Chờ thanh toán",
    pay_on_delivery: "Thu khi giao hàng",
    paid: "Đã thanh toán",
    failed: "Thanh toán lỗi",
    refunded: "Đã hoàn tiền",
  };
  return labels[status];
}

export function findProductFromOrderItem(slug: string) {
  return getProductBySlug(slug);
}
