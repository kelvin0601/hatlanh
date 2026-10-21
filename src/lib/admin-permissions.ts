export type AdminRole = "owner" | "admin" | "editor" | "fulfillment";

export type AdminPermission =
  | "catalog:write"
  | "content:write"
  | "orders:read"
  | "orders:write"
  | "staff:manage";

const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  owner: ["catalog:write", "content:write", "orders:read", "orders:write", "staff:manage"],
  admin: ["catalog:write", "content:write", "orders:read", "orders:write"],
  editor: ["catalog:write", "content:write"],
  fulfillment: ["orders:read", "orders:write"],
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Chủ cửa hàng",
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  fulfillment: "Xử lý đơn hàng",
};

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "owner" || value === "admin" || value === "editor" || value === "fulfillment";
}

export function hasPermission(role: AdminRole, permission: AdminPermission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

