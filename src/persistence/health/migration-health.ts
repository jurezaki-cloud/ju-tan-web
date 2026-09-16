import type { MigrationResult } from "@/src/types/postgres";
import { validateMigrations } from "../migrations/validate";
import { MIGRATION_REGISTRY } from "../migrations/registry";

export function checkMigrationHealth(results: MigrationResult[]): {
  ok: boolean;
  pending: string[];
  validationOk: boolean;
} {
  const validation = validateMigrations(MIGRATION_REGISTRY);
  const pending = results.filter((item) => !item.applied).map((item) => item.id);
  return {
    ok: validation.ok && pending.length === 0,
    pending,
    validationOk: validation.ok,
  };
}
