import type { DatabaseAdapter } from "@/src/types/persistence";
import { CompatiblePostgresDriver } from "../postgres/driver";
import { MigrationRunner, initPlaceholderMigration } from "../migrations/legacy";
import { PostgresMigrationRunner } from "../migrations/runner";
import { PersistenceEvents, PersistenceTracer } from "../observability";
import type { SeedRunner } from "../seed";

export function bindMigrations(
  adapter: DatabaseAdapter,
  pgDriver: CompatiblePostgresDriver,
  tracer: PersistenceTracer,
  events: PersistenceEvents,
  seed?: SeedRunner,
): { migrations: MigrationRunner; postgresMigrations: PostgresMigrationRunner } {
  return {
    migrations: new MigrationRunner(adapter, [initPlaceholderMigration]),
    postgresMigrations: new PostgresMigrationRunner(pgDriver, undefined, undefined, tracer, events, seed),
  };
}
