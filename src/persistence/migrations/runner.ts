import type { PostgresDriver, MigrationResult, MigrationStep } from "@/src/types/postgres";
import { MIGRATION_REGISTRY } from "./registry";
import { MigrationStatusStore } from "./status";
import { applyMigration } from "./apply";
import { rollbackOne } from "./rollback";
import { validateMigrations } from "./validate";
import { PersistenceEvents, PersistenceTracer } from "../observability";
import { runSeedHook } from "./seed";
import type { SeedRunner } from "../seed";

export class PostgresMigrationRunner {
  constructor(
    private readonly driver: PostgresDriver,
    private readonly registry: MigrationStep[] = MIGRATION_REGISTRY,
    private readonly statusStore = new MigrationStatusStore(),
    private readonly tracer = new PersistenceTracer(),
    private readonly events = new PersistenceEvents(),
    private readonly seed?: SeedRunner,
  ) {}

  list(): MigrationStep[] {
    return [...this.registry];
  }

  async run(): Promise<MigrationResult[]> {
    return this.applyPending();
  }

  async applyPending(dryRun = false): Promise<MigrationResult[]> {
    const validation = this.validate();
    if (!validation.ok) {
      throw new Error("migration-validation-failed");
    }
    const executeSql = this.physical();
    for (const step of this.registry) {
      if (this.statusStore.applied(step.id)) continue;
      const result = await this.tracer.measureAsync("migration", step.id, () =>
        applyMigration(this.driver, step, { dryRun, executeSql }),
      );
      this.events.emit("metrics", "migration", { id: step.id, dryRun, physical: executeSql }, result.durationMs);
      if (!dryRun) {
        this.statusStore.record(result);
        this.events.emit("audit", "migration-applied", { id: step.id });
      }
    }
    return this.status();
  }

  markApplied(id: string, name?: string): void {
    const step = this.registry.find((item) => item.id === id);
    this.statusStore.record({
      id,
      name: name ?? step?.name ?? id,
      applied: true,
      appliedAt: new Date().toISOString(),
    });
    this.events.emit("audit", "migration-marked", { id });
  }

  async rollback(id: string): Promise<MigrationResult | undefined> {
    return this.rollbackOne(id);
  }

  async rollbackOne(id: string): Promise<MigrationResult | undefined> {
    const step = this.registry.find((item) => item.id === id);
    if (!step) return undefined;
    const result = await rollbackOne(this.driver, step, this.physical());
    this.statusStore.record(result);
    this.events.emit("audit", "migration-rollback", { id });
    return result;
  }

  validate() {
    return validateMigrations(this.registry);
  }

  async dryRun(): Promise<MigrationResult[]> {
    return this.applyPending(true);
  }

  seedHook(): void {
    if (!this.seed) return;
    const started = Date.now();
    runSeedHook(this.seed);
    this.events.emit("audit", "seed-hook", undefined, Date.now() - started);
  }

  status(): MigrationResult[] {
    return this.registry.map((step) => {
      const found = this.statusStore.list().find((item) => item.id === step.id);
      return found ?? { id: step.id, name: step.name, applied: false };
    });
  }

  private physical(): boolean {
    return "physical" in this.driver && (this.driver as { physical?: boolean }).physical === true;
  }
}
