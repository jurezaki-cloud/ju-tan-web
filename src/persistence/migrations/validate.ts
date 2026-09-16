import type { MigrationStep } from "@/src/types/postgres";
import { splitSql } from "./split";

export type MigrationValidation = {
  ok: boolean;
  errors: string[];
};

export function validateMigrations(registry: MigrationStep[]): MigrationValidation {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const step of registry) {
    if (!step.id || !step.name) errors.push("migration-missing-id");
    if (ids.has(step.id)) errors.push(`duplicate-migration:${step.id}`);
    ids.add(step.id);
    if (!step.sql && !step.up) errors.push(`migration-empty:${step.id}`);
    if (step.sql) {
      const statements = splitSql(step.sql);
      if (statements.length === 0) errors.push(`migration-no-statements:${step.id}`);
    }
  }
  if (!registry.some((item) => item.id === "001")) errors.push("missing-init");
  return { ok: errors.length === 0, errors };
}
