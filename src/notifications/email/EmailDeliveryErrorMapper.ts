import type { NotificationFailureReason } from "@/src/types/notifications";

export class EmailDeliveryErrorMapper {
  mapFailure(error: unknown): NotificationFailureReason {
    const message = error instanceof Error ? error.message : String(error);
    const safe = message.replace(/pass(word)?=\S+/gi, "password=[redacted]");
    if (safe.includes("disabled") || safe.includes("not configured")) return "transport_disabled";
    if (safe.includes("payload") || safe.includes("recipient")) return "invalid_payload";
    if (safe.includes("policy") || safe.includes("denied")) return "policy_denied";
    if (safe.includes("timeout") || safe.includes("ECONN") || safe.includes("SMTP") || safe.includes("transport")) {
      return "transport_error";
    }
    return "unknown";
  }

  retryable(reason: NotificationFailureReason) {
    return reason === "transport_error" || reason === "unknown";
  }
}

export const emailDeliveryErrorMapper = new EmailDeliveryErrorMapper();
