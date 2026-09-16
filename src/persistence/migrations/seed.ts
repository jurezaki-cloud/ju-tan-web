import { SeedRunner } from "../seed";
import type { SeedContext } from "@/src/types/persistence";

export function runSeedHook(seed: SeedRunner, context?: SeedContext): void {
  seed.run(context);
}

export { SeedRunner };
