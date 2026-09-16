import type { RecoveryRecord } from "../types";

export class RecoveryEngine {
  start(goalId: string, error: string): RecoveryRecord {
    return {
      id: `rec-${goalId}`,
      goalId,
      error,
      attempts: [{ attempt: 1, strategy: "retry", note: "Ponovitev istega orodja." }],
      resolved: false,
    };
  }

  next(record: RecoveryRecord): RecoveryRecord {
    const order = ["fallback", "alternative-tool", "manual-approval", "continue"] as const;
    const attempt = record.attempts.length + 1;
    const strategy = order[Math.min(attempt - 2, order.length - 1)] ?? "continue";
    record.attempts.push({
      attempt,
      strategy,
      note:
        strategy === "fallback"
          ? "Poskus 2: nadomestni korak brez zunanjega klica."
          : strategy === "alternative-tool"
            ? "Nadomestno orodje iz registra."
            : strategy === "manual-approval"
              ? "Čakanje na ročno odobritev."
              : "Nadaljevanje z ostalimi koraki.",
    });
    if (strategy === "continue" || strategy === "manual-approval") record.resolved = true;
    return record;
  }
}
