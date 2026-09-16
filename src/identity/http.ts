import { NextResponse } from "next/server";
import { identityLog } from "@/src/identity/observability";

function statusForCode(code: string | undefined): 400 | 401 | 403 | 429 | undefined {
  if (code === "VALIDATION") return 400;
  if (code === "RATE_LIMIT" || code === "DISABLED" || code === "FORBIDDEN") return 403;
  if (
    code === "INVALID_CREDENTIALS" ||
    code === "INVALID_SESSION" ||
    code === "EXPIRED" ||
    code === "SESSION_FAILED"
  ) {
    return 401;
  }
  return undefined;
}

export function identityErrorResponse(error: unknown, fallback = "Zahteva ni uspela."): NextResponse {
  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; code?: unknown; httpStatus?: unknown; name?: unknown };
    const message = typeof candidate.message === "string" ? candidate.message : fallback;
    const code = typeof candidate.code === "string" ? candidate.code : undefined;
    const named =
      candidate.name === "AuthError" ||
      candidate.name === "ValidationError" ||
      candidate.name === "SessionError" ||
      candidate.name === "PermissionError" ||
      candidate.name === "IdentityError";
    const fromStatus =
      candidate.httpStatus === 400 || candidate.httpStatus === 401 || candidate.httpStatus === 403
        ? candidate.httpStatus
        : undefined;
    const status = fromStatus ?? (named ? statusForCode(code) ?? 401 : statusForCode(code));
    if (status) {
      return NextResponse.json({ ok: false, error: message, code: code ?? "IDENTITY" }, { status });
    }
  }
  identityLog("SessionFailed", { reason: "unexpected" });
  return NextResponse.json({ ok: false, error: fallback }, { status: 500 });
}
