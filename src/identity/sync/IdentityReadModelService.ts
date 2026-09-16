import type { IdentityUserRecord } from "@/src/domain/identity";
import type { IdentityUser } from "@/src/identity/types";
import {
  credentialRepository,
  identityAuditRepository,
  identityLockoutRepository,
  sessionIdentityRepository,
  userIdentityRepository,
} from "@/src/repositories/identity/store";
import { toKernelUser } from "./map";
import { hashIdentitySecret } from "./hash";

export class IdentityReadModelService {
  listUsers(): IdentityUserRecord[] {
    return userIdentityRepository.list();
  }

  getUser(id: string): IdentityUserRecord | undefined {
    return userIdentityRepository.getById(id);
  }

  getUserByEmail(email: string): IdentityUserRecord | undefined {
    return userIdentityRepository.getByEmail(email);
  }

  toKernelUsers(): IdentityUser[] {
    return this.listUsers().map((record) => this.toKernelUser(record));
  }

  toKernelUser(record: IdentityUserRecord): IdentityUser {
    const user = toKernelUser(record);
    const cred = credentialRepository.getByUser(user.id);
    return cred?.passwordHash ? { ...user, passwordHash: cred.passwordHash } : user;
  }

  sessionByAccess(token: string) {
    return sessionIdentityRepository.getByAccessHash(hashIdentitySecret(token));
  }

  sessionByRefresh(token: string) {
    return sessionIdentityRepository.getByRefreshHash(hashIdentitySecret(token));
  }

  sessionRevoked(sessionId: string): boolean {
    const row = sessionIdentityRepository.getById(sessionId, true);
    return Boolean(row?.revokedAt);
  }

  credential(userId: string) {
    return credentialRepository.getByUser(userId);
  }

  lockout(email: string) {
    return identityLockoutRepository.getByEmail(email);
  }

  audit(targetId: string) {
    return identityAuditRepository.listByTarget(targetId);
  }
}

export const identityReadModelService = new IdentityReadModelService();
