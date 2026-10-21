import { OrderManager } from "@/components/admin/OrderManager";
import { readAdminStore } from "@/lib/admin-store";

export default async function AdminOrdersPage() {
  return <OrderManager initialOrders={(await readAdminStore("orders:read")).orders} />;
}
