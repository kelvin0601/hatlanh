import { authorizeAdminRequest } from "@/lib/admin-auth";
import { createAdminUser, listAdminUsers, updateAdminUser } from "@/lib/admin-auth-store";
import { isAdminRole } from "@/lib/admin-permissions";
import { noStoreJson, verifyJsonRequest } from "@/lib/request-security";

export async function GET(request: Request) {
  const authorization = await authorizeAdminRequest(request, "staff:manage");
  if (!authorization.ok) return authorization.response;
  return noStoreJson({ users: await listAdminUsers() });
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 16_384);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "staff:manage", true);
  if (!authorization.ok) return authorization.response;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.username !== "string" || typeof body.name !== "string" || typeof body.password !== "string" || !isAdminRole(body.role)) {
      return noStoreJson({ message: "Thông tin nhân sự không hợp lệ." }, { status: 422 });
    }
    return noStoreJson({ user: await createAdminUser({ username: body.username, name: body.name, password: body.password, role: body.role }) }, { status: 201 });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể tạo tài khoản." }, { status: 422 });
  }
}

export async function PATCH(request: Request) {
  const requestCheck = verifyJsonRequest(request, 16_384);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  const authorization = await authorizeAdminRequest(request, "staff:manage", true);
  if (!authorization.ok) return authorization.response;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.id !== "string") return noStoreJson({ message: "Tài khoản không hợp lệ." }, { status: 422 });
    const data = typeof body.data === "object" && body.data ? body.data as Record<string, unknown> : {};
    const input: { name?: string; role?: typeof authorization.session.user.role; active?: boolean; password?: string } = {};
    if (data.name !== undefined) {
      if (typeof data.name !== "string") return noStoreJson({ message: "Tên không hợp lệ." }, { status: 422 });
      input.name = data.name;
    }
    if (data.role !== undefined) {
      if (!isAdminRole(data.role)) return noStoreJson({ message: "Vai trò không hợp lệ." }, { status: 422 });
      input.role = data.role;
    }
    if (data.active !== undefined) {
      if (typeof data.active !== "boolean") return noStoreJson({ message: "Trạng thái không hợp lệ." }, { status: 422 });
      input.active = data.active;
    }
    if (data.password !== undefined) {
      if (typeof data.password !== "string") return noStoreJson({ message: "Mật khẩu không hợp lệ." }, { status: 422 });
      input.password = data.password;
    }
    return noStoreJson({ user: await updateAdminUser(body.id, input, authorization.session.user.id) });
  } catch (error) {
    return noStoreJson({ message: error instanceof Error ? error.message : "Không thể cập nhật tài khoản." }, { status: 422 });
  }
}
