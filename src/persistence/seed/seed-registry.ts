import type { SeedStatus } from "@/src/types/persistence";
import { SEED_STEPS, type SeedStepId } from "./seed-data";

export class SeedRegistry {
  constructor(private readonly items: SeedStatus[] = SEED_STEPS.map((id) => ({ id, applied: false }))) {}

  mark(id: SeedStepId | string): void {
    const found = this.items.find((item) => item.id === id);
    const next = { id, applied: true, appliedAt: new Date().toISOString() };
    if (found) Object.assign(found, next);
    else this.items.push(next);
  }

  status(): SeedStatus[] {
    return this.items.map((item) => ({ ...item }));
  }

  applied(id: string): boolean {
    return this.items.some((item) => item.id === id && item.applied);
  }
}
