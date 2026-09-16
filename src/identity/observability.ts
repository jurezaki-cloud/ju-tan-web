export type IdentityLogType =
  | "LoginStarted"
  | "LoginSuccess"
  | "LoginFailed"
  | "SessionCreated"
  | "SessionFailed"
  | "RedirectResolved";

export type IdentityLogEvent = {
  type: IdentityLogType;
  at: string;
  payload?: Record<string, unknown>;
};

const SECRET_KEYS = new Set(["password", "token", "refreshToken", "passwordHash", "current", "next", "authorization"]);

const events: IdentityLogEvent[] = [];

function sanitize(payload: Record<string, unknown> = {}): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SECRET_KEYS.has(key.toLowerCase())) continue;
    next[key] = value;
  }
  return next;
}

export function identityLog(type: IdentityLogType, payload: Record<string, unknown> = {}): void {
  events.push({ type, at: new Date().toISOString(), payload: sanitize(payload) });
  if (events.length > 200) events.shift();
}

export function listIdentityLogs(): IdentityLogEvent[] {
  return [...events];
}
