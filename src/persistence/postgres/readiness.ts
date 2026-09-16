import type { HealthState, ReadinessState, SeedStatus } from "@/src/types/persistence";
import type { MigrationResult } from "@/src/types/postgres";

export function resolveReadiness(input: {
  requestedMode: "mock" | "postgres";
  actualMode: "mock" | "postgres";
  fallback?: string;
  migrations: MigrationResult[];
  seed: SeedStatus[];
  connectionOk: boolean;
  maintenance?: boolean;
}): { state: ReadinessState; health: HealthState } {
  const migrationsOk = input.migrations.every((item) => item.applied);
  const seedOk = input.seed.length === 0 || input.seed.every((item) => item.applied);
  const driver: HealthState["driver"] =
    input.actualMode === "mock" ? "mock" : input.fallback ? "compatible" : "compatible";

  if (input.maintenance) {
    return {
      state: "maintenance",
      health: {
        ok: false,
        status: "maintenance",
        latencyMs: 0,
        driver,
        migrations: migrationsOk,
        seed: seedOk,
        available: false,
      },
    };
  }

  if (input.fallback) {
    return {
      state: "fallback",
      health: {
        ok: true,
        status: "fallback",
        latencyMs: 0,
        driver: "mock",
        migrations: migrationsOk,
        seed: seedOk,
        available: true,
      },
    };
  }

  if (!input.connectionOk || !migrationsOk) {
    return {
      state: "degraded",
      health: {
        ok: false,
        status: "degraded",
        latencyMs: 0,
        driver,
        migrations: migrationsOk,
        seed: seedOk,
        available: input.connectionOk,
      },
    };
  }

  return {
    state: "ready",
    health: {
      ok: true,
      status: "ready",
      latencyMs: 0,
      driver: input.actualMode === "postgres" ? "compatible" : "mock",
      migrations: migrationsOk,
      seed: seedOk,
      available: true,
    },
  };
}
