import { store } from "@/src/repositories/mock/store";
import { err, ok, type Result } from "@/src/types/platform";
import type { Conversation } from "@/src/domain/conversation";
import type { Automation } from "@/src/domain/automation";
import type { AiOverview } from "@/src/types/platform";

export class AIService {
  getOverview(): Result<AiOverview> {
    try {
      return ok({
        conversations: store.ai.conversations,
        successRate: store.ai.successRate,
        timeSaved: store.ai.timeSaved,
        automations: store.ai.automations,
        topQuestions: store.topQuestions,
      });
    } catch {
      return err("AI statistike ni bilo mogoče naložiti.");
    }
  }

  listConversations(): Result<Conversation[]> {
    try {
      return ok(store.conversations);
    } catch {
      return err("Pogovorov ni bilo mogoče naložiti.");
    }
  }

  listAutomations(): Result<Automation[]> {
    try {
      return ok(store.automations);
    } catch {
      return err("Avtomatizacij ni bilo mogoče naložiti.");
    }
  }
}

export const aiService = new AIService();
