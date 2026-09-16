import type { IntegrationAudit, IntegrationAuditEvent } from "@/src/types/integrations";

export class InMemoryIntegrationAudit implements IntegrationAudit {
  constructor(private readonly events: IntegrationAuditEvent[] = []) {}

  record(event: IntegrationAuditEvent): void {
    this.events.push({ ...event, payload: event.payload ? { ...event.payload } : undefined });
  }

  list(): IntegrationAuditEvent[] {
    return this.events.map((item) => ({ ...item }));
  }
}

export function stamp(type: IntegrationAuditEvent["type"], payload?: Record<string, unknown>): IntegrationAuditEvent {
  return { type, at: new Date().toISOString(), payload };
}
