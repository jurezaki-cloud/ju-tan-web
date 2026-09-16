import { identityConfig } from "@/src/identity/config";
import { SessionError } from "@/src/identity/errors";
import { identityLog } from "@/src/identity/observability";
import type { IdentitySession } from "@/src/identity/types";
import type { SessionRepository } from "@/src/identity/repositories/SessionRepository";
import type { TokenService } from "@/src/identity/tokens/TokenService";
import type { MockIdentityStore } from "@/src/identity/repositories/MockIdentityStore";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";

export class SessionService {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly tokens: TokenService,
    private readonly store: MockIdentityStore,
    private readonly now: () => Date = () => new Date(),
  ) {}

  create(input: {
    userId: string;
    role: string;
    rememberMe?: boolean;
    ipAddress?: string;
    device?: string;
    rotatedFromTokenId?: string;
    persist?: boolean;
  }): IdentitySession {
    try {
    const now = this.now();
    const ttl = input.rememberMe ? identityConfig.rememberTtlMs : identityConfig.accessTtlMs;
    const sid = `ses-${now.getTime()}-${input.userId}`;
    const iat = now.getTime();
    const exp = iat + ttl;
    const token = this.tokens.issue({
      typ: "access",
      sub: input.userId,
      role: input.role,
      sid,
      exp,
      iat,
    });
    const refreshToken = this.tokens.issue({
      typ: "refresh",
      sub: input.userId,
      role: input.role,
      sid,
      exp: iat + identityConfig.refreshTtlMs,
      iat,
    });
    const session: IdentitySession = {
      id: sid,
      userId: input.userId,
      token,
      refreshToken,
      expiresAt: new Date(exp).toISOString(),
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      ipAddress: input.ipAddress ?? "127.0.0.1",
      device: input.device ?? "web",
    };
    this.sessions.save(session, {
      rememberMe: input.rememberMe,
      rotatedFromTokenId: input.rotatedFromTokenId,
      persist: input.persist,
    });
    identityLog("SessionCreated", { userId: input.userId, sessionId: sid });
    return session;
    } catch (error) {
      identityLog("SessionFailed", { userId: input.userId });
      if (error instanceof SessionError) throw error;
      throw new SessionError("Seje ni bilo mogoče ustvariti.", "SESSION_FAILED");
    }
  }

  destroy(id: string): void {
    this.store.revoked.add(id);
    this.sessions.delete(id);
  }

  extend(id: string, ttlMs = identityConfig.accessTtlMs): IdentitySession | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    const exp = this.now().getTime() + ttlMs;
    const payload = this.tokens.parse(session.token);
    if (!payload) return undefined;
    const next: IdentitySession = {
      ...session,
      token: this.tokens.issue(this.tokens.rotate(payload, ttlMs, this.now().getTime())),
      expiresAt: new Date(exp).toISOString(),
      lastActivity: this.now().toISOString(),
    };
    this.sessions.save(next);
    return next;
  }

  validate(token: string): IdentitySession | undefined {
    const payload = this.tokens.parse(token);
    if (!payload || payload.typ !== "access") return undefined;
    if (this.store.revoked.has(payload.sid)) return undefined;
    if (identitySyncService.sessionRevoked(payload.sid)) {
      this.store.revoked.add(payload.sid);
      return undefined;
    }
    if (this.tokens.expired(payload)) return undefined;
    const session = this.sessions.get(payload.sid);
    if (session) {
      session.lastActivity = this.now().toISOString();
      this.sessions.save(session, { persist: false });
      return session;
    }
    return {
      id: payload.sid,
      userId: payload.sub,
      token,
      refreshToken: "",
      expiresAt: new Date(payload.exp).toISOString(),
      createdAt: new Date(payload.iat).toISOString(),
      lastActivity: this.now().toISOString(),
      ipAddress: "127.0.0.1",
      device: "web",
    };
  }

  find(id: string): IdentitySession | undefined {
    return this.sessions.get(id);
  }

  forUser(userId: string): IdentitySession[] {
    return this.sessions.byUser(userId);
  }
}
