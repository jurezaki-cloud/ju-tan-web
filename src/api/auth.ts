import { mockSession } from "@/src/config/platform";
import { ok, type Result } from "@/src/types/platform";
import type { Session } from "@/src/types/auth";

export async function getSession(): Promise<Result<Session>> {
  return ok(mockSession);
}
