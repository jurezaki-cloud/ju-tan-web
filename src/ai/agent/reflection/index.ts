import type { Reflection } from "../types";

export class ReflectionEngine {
  evaluate(goalId: string, stepId: string | undefined, ok: boolean, detail: string): Reflection {
    return {
      id: `ref-${goalId}-${stepId ?? "goal"}`,
      goalId,
      stepId,
      succeeded: ok ? detail : "Korak ni zaključen.",
      failed: ok ? "Ni napake." : detail,
      improve: ok ? "Naslednjič predhodno uskladi odobritev." : "Uporabi fallback orodje ali ročno odobritev.",
      continue: ok,
      at: new Date().toISOString(),
    };
  }
}
