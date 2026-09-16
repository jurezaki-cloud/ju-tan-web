import type { HealthState, ReadinessState, SeedStatus } from "@/src/types/persistence";
import { resolveReadiness } from "../postgres/readiness";
import type { PersistenceBundle } from "../createPersistence";

export type ReadinessCache = {
  at: number;
  state: ReadinessState;
  health: HealthState;
};

export function checkDbReadiness(
  persistence: PersistenceBundle,
  health: HealthState,
  seed: SeedStatus[] = [],
  cache?: { current?: ReadinessCache },
  ttlMs = 1500,
): { state: ReadinessState; health: HealthState } {
  if (cache?.current && Date.now() - cache.current.at < ttlMs) {
    return { state: cache.current.state, health: cache.current.health };
  }
  const resolved = resolveReadiness({
    requestedMode: persistence.mode,
    actualMode: persistence.mode,
    fallback: persistence.fallback,
    migrations: persistence.postgresMigrations.status(),
    seed,
    connectionOk: health.available,
  });
  const nextHealth = { ...resolved.health, latencyMs: health.latencyMs, driver: health.driver };
  if (cache) cache.current = { at: Date.now(), state: resolved.state, health: nextHealth };
  return { state: resolved.state, health: nextHealth };
}
