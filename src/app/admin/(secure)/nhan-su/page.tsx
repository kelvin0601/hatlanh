import { UserManager } from "@/components/admin/UserManager";
import { requireAdminSession } from "@/lib/admin-auth";
import { listAdminUsers } from "@/lib/admin-auth-store";

export default async function AdminUsersPage() {
  await requireAdminSession("staff:manage");
  return <UserManager initialUsers={await listAdminUsers()} />;
}
