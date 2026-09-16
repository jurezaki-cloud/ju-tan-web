import type { PersistenceConfig } from "@/src/types/persistence";
import type { BootstrapResult, PostgresClientHandle } from "@/src/types/postgres";
import { createPersistence, loadPersistenceConfig, type PersistenceBundle } from "../createPersistence";
import { resolvePersistenceMode, resolvePostgresConfig } from "./resolve";
import { checkDbHealth } from "../health/db-health-check";
import { checkDbReadiness } from "../health/db-readiness-check";
import { bindHealth } from "../wiring/bindHealth";
import { PersistenceEvents } from "../observability";

export { resolvePersistenceMode, resolvePostgresConfig };

export function createMockBootstrap(config: Partial<PersistenceConfig> = {}): PersistenceBundle {
  return createPersistence({
    ...loadPersistenceConfig(),
    ...config,
    mode: "mock",
  });
}

export function createPostgresBootstrap(config: Partial<PersistenceConfig> = {}): PersistenceBundle {
  return createPersistence({
    ...loadPersistenceConfig(),
    ...config,
    mode: "postgres",
  });
}

export function createPersistenceBootstrap(
  config?: Partial<PersistenceConfig>,
): BootstrapResult<PersistenceBundle> & {
  events: PersistenceEvents;
  healthBinding: ReturnType<typeof bindHealth>;
} {
  const base = loadPersistenceConfig();
  const merged: PersistenceConfig = {
    ...base,
    ...config,
    tenant: config?.tenant ?? base.tenant,
    mode: config?.mode ?? base.mode,
  };
  const persistence = createPersistence(merged);
  const handle: PostgresClientHandle = persistence.handle;
  const healthBinding = bindHealth(persistence, handle, persistence.seedStatus);
  const snapshot = {
    ok: true,
    status: persistence.fallback ? ("fallback" as const) : ("ready" as const),
    latencyMs: 0,
    driver: persistence.mode === "mock" ? ("mock" as const) : handle.kind,
    migrations: persistence.postgresMigrations.status().every((item) => item.applied),
    seed: persistence.seedStatus.every((item) => item.applied),
    available: true,
  };
  const readiness = checkDbReadiness(persistence, snapshot, persistence.seedStatus);
  persistence.events.readiness(readiness.state, persistence.fallback);
  void checkDbHealth(persistence, handle);
  return {
    persistence,
    handle,
    readiness: readiness.state,
    health: readiness.health,
    fallback: persistence.fallback,
    seed: persistence.seedStatus,
    events: persistence.events,
    healthBinding,
  };
}
