import { entity, nextId, nowIso, runIdentityTx, writeAudit } from "@/src/services/identity/shared";
import { inviteSecurityRepository } from "@/src/repositories/security";
import type { InviteSecurityState } from "@/src/types/security";

const LOCK_MS = 15 * 60 * 1000;
const MAX_INVALID = 8;

export class InviteTokenGuard {
  state(tokenHash: string, inviteId?: string): InviteSecurityState {
    const existing = inviteSecurityRepository.getByTokenHash(tokenHash);
    if (existing) return existing;
    const created: InviteSecurityState = {
      ...entity(nextId("isec"), "active", "system"),
      status: "active",
      tokenHash,
      inviteId,
      replayed: false,
      invalidAttempts: 0,
    };
    return runIdentityTx(() => inviteSecurityRepository.save(created));
  }

  locked(state: InviteSecurityState) {
    return Boolean(state.lockedUntil && new Date(state.lockedUntil).getTime() > Date.now());
  }

  fail(state: InviteSecurityState): InviteSecurityState {
    const invalidAttempts = state.invalidAttempts + 1;
    const locked = invalidAttempts >= MAX_INVALID;
    const next: InviteSecurityState = {
      ...state,
      invalidAttempts,
      status: locked ? "locked" : state.status,
      lockedUntil: locked ? new Date(Date.now() + LOCK_MS).toISOString() : state.lockedUntil,
      updatedAt: nowIso(),
      version: state.version + 1,
    };
    runIdentityTx(() => inviteSecurityRepository.save(next));
    if (locked) writeAudit("InviteTokenLocked", "system", state.inviteId ?? state.tokenHash, { invalidAttempts });
    return next;
  }

  lock(tokenHash: string, inviteId?: string) {
    const state = this.state(tokenHash, inviteId);
    const next: InviteSecurityState = {
      ...state,
      status: "locked",
      lockedUntil: new Date(Date.now() + LOCK_MS).toISOString(),
      updatedAt: nowIso(),
    };
    runIdentityTx(() => inviteSecurityRepository.save(next));
    writeAudit("InviteTokenLocked", "system", inviteId ?? tokenHash, {});
    return next;
  }

  unlock(tokenHash: string) {
    const state = inviteSecurityRepository.getByTokenHash(tokenHash);
    if (!state) return undefined;
    const next: InviteSecurityState = {
      ...state,
      status: "active",
      lockedUntil: undefined,
      invalidAttempts: 0,
      updatedAt: nowIso(),
    };
    return runIdentityTx(() => inviteSecurityRepository.save(next));
  }

  replay(state: InviteSecurityState) {
    const next = { ...state, replayed: true, status: "locked" as const, updatedAt: nowIso() };
    runIdentityTx(() => inviteSecurityRepository.save(next));
    writeAudit("InviteReplayBlocked", "system", state.inviteId ?? state.tokenHash, {});
    return next;
  }
}

export const inviteTokenGuard = new InviteTokenGuard();
