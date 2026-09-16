import type { PostgresDriver, MigrationResult, MigrationStep } from "@/src/types/postgres";
import { splitSql } from "./split";

export async function rollbackOne(
  driver: PostgresDriver,
  step: MigrationStep,
  executeSql: boolean,
): Promise<MigrationResult> {
  if (executeSql) {
    if (step.downSql) {
      for (const statement of splitSql(step.downSql)) {
        await driver.execute(statement, []);
      }
    }
    if (step.down) await step.down(driver);
  }
  return { id: step.id, name: step.name, applied: false, appliedAt: undefined };
}
