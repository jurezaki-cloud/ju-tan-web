import type { PersistenceBundle } from "../createPersistence";
import type { PostgresClientHandle } from "@/src/types/postgres";
import { checkDbHealth } from "../health/db-health-check";
import { checkDbReadiness } from "../health/db-readiness-check";
import { checkMigrationHealth } from "../health/migration-health";
import type { SeedStatus } from "@/src/types/persistence";

export function bindHealth(persistence: PersistenceBundle, handle: PostgresClientHandle, seed: SeedStatus[] = []) {
  const readinessCache: { current?: import("../health/db-readiness-check").ReadinessCache } = {};
  return {
    checkHealth: () => checkDbHealth(persistence, handle),
    checkReadiness: async () => {
      const health = await checkDbHealth(persistence, handle);
      return checkDbReadiness(persistence, health, seed, readinessCache);
    },
    checkMigrations: () => checkMigrationHealth(persistence.postgresMigrations.status()),
  };
}
