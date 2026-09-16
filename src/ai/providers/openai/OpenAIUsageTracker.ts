import type { TokenUsage } from "@/src/ai/types/provider";

export class OpenAIUsageTracker {
  constructor(private readonly totals: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 }) {}

  add(usage: TokenUsage) {
    this.totals.promptTokens += usage.promptTokens;
    this.totals.completionTokens += usage.completionTokens;
    this.totals.totalTokens += usage.totalTokens;
    return { ...this.totals };
  }

  snapshot() {
    return { ...this.totals };
  }
}

export const openAIUsageTracker = new OpenAIUsageTracker();
