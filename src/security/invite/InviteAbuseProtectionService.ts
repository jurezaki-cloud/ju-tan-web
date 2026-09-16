import { entity, nextId, runIdentityTx, writeAudit } from "@/src/services/identity/shared";
import { abuseFlagRepository } from "@/src/repositories/security";

export class InviteCooldownPolicy {
  constructor(readonly recentMs = 15 * 60 * 1000) {}
}

export class InviteAbusePolicy {
  constructor(readonly maxFlags = 5) {}
}

export class InviteAbuseProtectionService {
  constructor(private readonly policy = new InviteAbusePolicy()) {}

  flag(actorId: string, subject: string, kind: string) {
    const record = runIdentityTx(() =>
      abuseFlagRepository.save({
        ...entity(nextId("abf"), "open", actorId),
        kind,
        subject,
        actorId,
      }),
    );
    writeAudit("InviteAbuseFlagged", actorId, subject, { kind });
    return record;
  }

  count(subject: string) {
    return abuseFlagRepository.list({ includeDeleted: true }).filter((item) => item.subject === subject).length;
  }

  suspicious(subject: string) {
    return this.count(subject) >= this.policy.maxFlags;
  }
}

export const inviteAbuseProtectionService = new InviteAbuseProtectionService();
export const inviteCooldownPolicy = new InviteCooldownPolicy();
