import type { OfferAuditEventType } from "@/src/types/offers";
import { recordCrmAudit } from "./crmAudit";

export function recordOfferAudit(type: OfferAuditEventType, payload: Record<string, unknown> = {}): void {
  recordCrmAudit(type, payload);
}
