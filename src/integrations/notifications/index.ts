import type { NotificationAdapter, NotificationPayload, IntegrationAudit } from "@/src/types/integrations";
import { stamp } from "../audit";
import type { IntegrationPolicy } from "../policies";

export class MockNotificationAdapter implements NotificationAdapter {
  constructor(
    private readonly policy: IntegrationPolicy,
    private readonly audit: IntegrationAudit,
    private seq = 0,
  ) {}

  prepare(payload: NotificationPayload) {
    const requiresApproval = payload.requiresApproval || this.policy.notificationRequiresApproval(payload.channel);
    const prepared = {
      ...payload,
      requiresApproval,
      id: `ntf-${++this.seq}`,
      status: requiresApproval && payload.channel !== "in-app" ? ("blocked" as const) : ("prepared" as const),
    };
    this.audit.record(stamp("NotificationPrepared", { id: prepared.id, channel: payload.channel, blocked: prepared.status === "blocked" }));
    return prepared;
  }
}

export class NotificationComposer {
  compose(title: string, body: string, channel: NotificationPayload["channel"] = "in-app"): NotificationPayload {
    return { channel, title, body, requiresApproval: channel !== "in-app" };
  }
}

export class NotificationRouter {
  constructor(private readonly adapter: NotificationAdapter) {}

  route(payload: NotificationPayload) {
    return this.adapter.prepare(payload);
  }
}
