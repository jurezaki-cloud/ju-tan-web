import type { IdentityEvent } from "@/src/identity/types";
import type { AuditRepository } from "@/src/identity/repositories/SessionRepository";

export class IdentityAudit {
  constructor(private readonly audit: AuditRepository) {}

  record(event: IdentityEvent): void {
    this.audit.record(event);
  }

  list(): IdentityEvent[] {
    return this.audit.list();
  }
}
