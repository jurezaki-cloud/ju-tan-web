import type { DatabaseAdapter, Migration, MigrationStatus } from "@/src/types/persistence";

export class MigrationRunner {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly migrations: Migration[],
    private readonly applied: MigrationStatus[] = [],
  ) {}

  async run(): Promise<MigrationStatus[]> {
    for (const migration of this.migrations) {
      if (this.applied.some((item) => item.id === migration.id && item.applied)) continue;
      await migration.up(this.adapter);
      this.applied.push({
        id: migration.id,
        name: migration.name,
        applied: true,
        appliedAt: new Date().toISOString(),
      });
    }
    return this.status();
  }

  status(): MigrationStatus[] {
    return this.migrations.map((migration) => {
      const found = this.applied.find((item) => item.id === migration.id);
      return found ?? { id: migration.id, name: migration.name, applied: false };
    });
  }
}

export const initPlaceholderMigration: Migration = {
  id: "001",
  name: "init",
  async up() {
    return;
  },
};
