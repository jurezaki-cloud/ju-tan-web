import type { TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceEvents, PersistenceTracer } from "../observability";
import { SeedRunner } from "../seed";
import { PersistenceSeedRunner } from "../seed/seed-runner";
import { SeedRegistry } from "../seed/seed-registry";

export function bindSeedRunner(
  tables: InMemoryTables,
  tenant: TenantScope,
  tracer: PersistenceTracer,
  events: PersistenceEvents,
): { seed: SeedRunner; pipeline: PersistenceSeedRunner } {
  const seed = new SeedRunner(tables, tenant);
  const pipeline = new PersistenceSeedRunner(tables, tenant, seed, new SeedRegistry(), tracer, events);
  return { seed, pipeline };
}
