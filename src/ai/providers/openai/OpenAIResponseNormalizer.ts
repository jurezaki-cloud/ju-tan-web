import type { ChatResponse, TokenUsage } from "@/src/ai/types/provider";

type OpenAIChatJson = {
  model?: string;
  choices?: { message?: { content?: string }; delta?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

export class OpenAIResponseNormalizer {
  usage(input: OpenAIChatJson["usage"], fallback: TokenUsage): TokenUsage {
    return {
      promptTokens: input?.prompt_tokens ?? fallback.promptTokens,
      completionTokens: input?.completion_tokens ?? fallback.completionTokens,
      totalTokens: input?.total_tokens ?? fallback.totalTokens,
    };
  }

  chat(json: OpenAIChatJson, model: string): ChatResponse {
    const content = json.choices?.[0]?.message?.content ?? "";
    const usage = this.usage(json.usage, {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    });
    return { content, model: json.model ?? model, usage };
  }

  delta(json: OpenAIChatJson) {
    return json.choices?.[0]?.delta?.content ?? "";
  }
}

export const openAIResponseNormalizer = new OpenAIResponseNormalizer();
