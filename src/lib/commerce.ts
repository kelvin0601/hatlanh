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
  paymentStatus: "pending" | "pay_on_delivery";
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  emailStatus: "sent" | "not_configured" | "failed";
}

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

export function findProductFromOrderItem(slug: string) {
  return getProductBySlug(slug);
}
