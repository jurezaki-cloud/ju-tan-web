import type { PersistenceBundle } from "../createPersistence";
import type { PostgresClientHandle } from "@/src/types/postgres";
import type { HealthState } from "@/src/types/persistence";
import { checkPostgresHealth } from "../postgres/health";

export async function checkDbHealth(
  persistence: PersistenceBundle,
  handle: PostgresClientHandle,
): Promise<HealthState> {
  const probe = await checkPostgresHealth(handle);
  const migrations = persistence.postgresMigrations.status().every((item) => item.applied);
  const seedOk = persistence.tables.list("organizations", persistence.tenant).length > 0;
  return {
    ok: probe.ok || handle.kind === "compatible",
    status: persistence.fallback ? "fallback" : probe.ok || handle.kind === "compatible" ? "ready" : "degraded",
    latencyMs: probe.latencyMs,
    driver: persistence.mode === "mock" ? "mock" : handle.kind,
    migrations,
    seed: seedOk,
    available: probe.available,
  };
}
