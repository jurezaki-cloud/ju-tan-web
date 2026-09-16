import type { HealthState } from "@/src/types/persistence";
import type { PostgresClientHandle } from "@/src/types/postgres";
import type { CachedProbe } from "./types";

export async function checkPostgresHealth(
  handle: PostgresClientHandle,
  ttlMs = 2000,
  cache?: { current?: CachedProbe },
): Promise<{ ok: boolean; latencyMs: number; available: boolean; driver: HealthState["driver"] }> {
  const now = Date.now();
  if (cache?.current && now - cache.current.at < ttlMs) {
    return {
      ok: cache.current.value,
      latencyMs: cache.current.latencyMs,
      available: cache.current.value || handle.kind === "compatible",
      driver: handle.kind === "live" ? "live" : "compatible",
    };
  }
  const started = Date.now();
  const ok = await handle.ping();
  const latencyMs = Date.now() - started;
  if (cache) cache.current = { at: Date.now(), value: ok, latencyMs };
  return {
    ok,
    latencyMs,
    available: handle.kind === "compatible" || ok,
    driver: handle.kind === "live" ? "live" : "compatible",
  };
}
