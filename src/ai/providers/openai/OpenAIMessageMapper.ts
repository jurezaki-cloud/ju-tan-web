import type { ProviderChatMessage } from "@/src/ai/types/provider";

export class OpenAIMessageMapper {
  toOpenAI(messages: ProviderChatMessage[]) {
    return messages
      .filter((item) => item.content.trim().length > 0)
      .map((item) => ({ role: item.role, content: item.content }));
  }
}

export const openAIMessageMapper = new OpenAIMessageMapper();
