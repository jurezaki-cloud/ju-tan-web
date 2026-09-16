import type { MigrationResult } from "@/src/types/postgres";

export class MigrationStatusStore {
  constructor(private readonly results: MigrationResult[] = []) {}

  record(result: MigrationResult): void {
    const index = this.results.findIndex((item) => item.id === result.id);
    if (index >= 0) this.results[index] = result;
    else this.results.push(result);
  }

  list(): MigrationResult[] {
    return [...this.results];
  }

  applied(id: string): boolean {
    return this.results.some((item) => item.id === id && item.applied);
  }
}
