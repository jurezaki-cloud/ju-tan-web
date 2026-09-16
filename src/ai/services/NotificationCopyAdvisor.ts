import type { ChatResponse } from "@/src/ai/types/provider";
import { openAIProviderService } from "@/src/ai/providers/openai";
import { openaiReady } from "@/src/ai/providers/openai/OpenAIConfig";

export type NotificationCopyAdvice = {
  subject: string;
  onboardingCopy: string;
  channel: "email" | "in-app";
  resendWaitSec: number;
  fallbackMessage: string;
  providerId: string;
  usage?: ChatResponse["usage"];
};

function heuristic(email: string): NotificationCopyAdvice {
  return {
    subject: "Povabilo v JU-TAN",
    onboardingCopy: "Nastavite geslo prek invite povezave, se prijavite in preglejte profil.",
    channel: email.includes("@") ? "email" : "in-app",
    resendWaitSec: 300,
    fallbackMessage: "Povabilo je pripravljeno. Če e-pošta ni dostavljena, kopirajte povezavo.",
    providerId: openaiReady() ? "openai" : "mock",
  };
}

export class NotificationCopyAdvisor {
  async advise(email: string): Promise<NotificationCopyAdvice> {
    const base = heuristic(email);
    const result = await openAIProviderService.chat({
      messages: [
        { role: "system", content: "Predlagaj kratko zadevo in onboarding stavek. Ne razkrivaj skrivnosti." },
        { role: "user", content: "invite onboarding" },
      ],
      maxTokens: 80,
      temperature: 0.2,
    });
    if (!result.ok) return base;
    return {
      ...base,
      subject: result.data.content.split("\n")[0]?.slice(0, 80) || base.subject,
      onboardingCopy: result.data.content.slice(0, 240) || base.onboardingCopy,
      providerId: openaiReady() ? "openai" : result.data.model.includes("mock") ? "mock" : "openai",
      usage: result.data.usage,
    };
  }
}

export const notificationCopyAdvisor = new NotificationCopyAdvisor();
