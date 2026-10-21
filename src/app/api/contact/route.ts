import { sendContactEmail } from "@/lib/email";
import { anonymizeRateLimitKey, getClientAddress, noStoreJson, takeRateLimit, verifyJsonRequest, verifySameOrigin } from "@/lib/request-security";

interface ContactRequest {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export async function POST(request: Request) {
  const requestCheck = verifyJsonRequest(request, 16_384);
  if (!requestCheck.ok) return noStoreJson({ message: requestCheck.message }, { status: requestCheck.status });
  if (!verifySameOrigin(request)) return noStoreJson({ message: "Nguồn yêu cầu không hợp lệ." }, { status: 403 });
  const rateLimit = takeRateLimit(anonymizeRateLimitKey(`contact:${getClientAddress(request)}`), 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) return noStoreJson({ message: "Bạn đã gửi quá nhiều lời nhắn. Vui lòng thử lại sau." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });

  let body: ContactRequest;
  try {
    const parsed = (await request.json()) as unknown;
    if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid payload");
    body = parsed as ContactRequest;
  } catch {
    return noStoreJson({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 2000 || phone.length > 20) {
    return noStoreJson({ message: "Vui lòng kiểm tra lại nội dung liên hệ." }, { status: 422 });
  }

  const emailStatus = await sendContactEmail({ name, email, phone, message });
  if (emailStatus === "failed") {
    return noStoreJson({ message: "Chưa thể gửi lời nhắn. Vui lòng thử lại sau." }, { status: 502 });
  }

  return noStoreJson({
    message: emailStatus === "sent" ? "Hạt Lành đã nhận lời nhắn của bạn." : "Biểu mẫu hợp lệ nhưng email chưa được gửi vì website đang ở chế độ demo.",
    emailStatus,
  });
}
