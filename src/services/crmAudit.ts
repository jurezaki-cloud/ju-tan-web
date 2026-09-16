import type { CrmAuditEventType } from "@/src/types/crm";
import { appPersistence } from "@/src/persistence/app";

export function recordCrmAudit(type: CrmAuditEventType, payload: Record<string, unknown> = {}): void {
  const id = `aud-${type}-${Date.now().toString(36)}`;
  appPersistence.repositories.audit.save({
    id,
    ...( { type, at: new Date().toISOString(), ...payload } as Record<string, unknown>),
  } as { id: string });
}
