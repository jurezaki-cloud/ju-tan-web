import type { IdentityEvent, IdentitySession, IdentityUser } from "@/src/identity/types";
import { mockIdentityUsers } from "@/src/identity/users/mockUsers";
import { identityDemoEnabled } from "@/src/identity/config";

export class MockIdentityStore {
  readonly users: IdentityUser[];
  readonly sessions = new Map<string, IdentitySession>();
  readonly refresh = new Map<string, string>();
  readonly resetTokens = new Map<string, { userId: string; exp: number }>();
  readonly audit: IdentityEvent[] = [];
  readonly revoked = new Set<string>();

  constructor(users: IdentityUser[] = identityDemoEnabled() ? mockIdentityUsers.map((item) => ({ ...item })) : []) {
    this.users = users;
  }

  replaceUsers(users: IdentityUser[]) {
    this.users.splice(0, this.users.length, ...users.map((item) => ({ ...item })));
  }
}
