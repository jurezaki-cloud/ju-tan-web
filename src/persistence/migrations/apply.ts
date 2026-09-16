import type { PostgresDriver, MigrationResult, MigrationStep } from "@/src/types/postgres";
import { splitSql } from "./split";

export type ApplyOptions = {
  dryRun?: boolean;
  executeSql?: boolean;
};

export async function applyMigration(
  driver: PostgresDriver,
  step: MigrationStep,
  options: ApplyOptions = {},
): Promise<MigrationResult> {
  const started = Date.now();
  if (!options.dryRun && options.executeSql) {
    if (step.sql) {
      for (const statement of splitSql(step.sql)) {
        await driver.execute(statement, []);
      }
    }
    if (step.up) await step.up(driver);
  }
  return {
    id: step.id,
    name: step.name,
    applied: !options.dryRun,
    appliedAt: options.dryRun ? undefined : new Date().toISOString(),
    durationMs: Date.now() - started,
  };
}

export async function applyPending(
  driver: PostgresDriver,
  pending: MigrationStep[],
  options: ApplyOptions = {},
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  for (const step of pending) {
    results.push(await applyMigration(driver, step, options));
  }
  return results;
}
