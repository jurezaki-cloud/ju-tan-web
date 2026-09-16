import { relativeInviteLink } from "../config";
import { scope } from "@/src/services/identity/shared";
import { WebhookSignature } from "./WebhookSignature";

export class WebhookPayloadBuilder {
  constructor(private readonly signature = new WebhookSignature()) {}

  build(input: {
    inviteId: string;
    email: string;
    role: string;
    workspace: string;
    inviteLink: string;
    expiresAt: string;
    note: string;
    status: string;
  }) {
    const tenant = scope();
    const payload = {
      inviteId: input.inviteId,
      email: input.email,
      role: input.role,
      workspace: input.workspace,
      inviteLink: relativeInviteLink(input.inviteLink),
      expiresAt: input.expiresAt,
      tenantId: tenant.tenantId,
      organizationId: tenant.organizationId,
      note: input.note,
      status: input.status,
    };
    const body = JSON.stringify(payload);
    return {
      body,
      signature: this.signature.sign(body),
      payload,
    };
  }
}
