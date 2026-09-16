import type { NotificationFailureReason } from "@/src/types/notifications";

export class NotificationFailureMapper {
  mapFailure(error: unknown): NotificationFailureReason {
    const message = error instanceof Error ? error.message : String(error);
    const safe = message.replace(/sk-[a-zA-Z0-9._-]+/g, "[redacted]").replace(/pass(word)?=\S+/gi, "password=[redacted]");
    if (safe.includes("disabled")) return "transport_disabled";
    if (safe.includes("payload")) return "invalid_payload";
    if (safe.includes("policy")) return "policy_denied";
    if (safe.includes("timeout") || safe.includes("SMTP") || safe.includes("transport")) return "transport_error";
    return "unknown";
  }
}
