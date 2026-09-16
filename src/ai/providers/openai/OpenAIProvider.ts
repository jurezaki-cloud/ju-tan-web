import type { AIProvider, ChatRequest, ChatResponse } from "@/src/ai/types/provider";
import { MockProvider } from "@/src/ai/providers/MockProvider";
import { writeAudit } from "@/src/services/identity/shared";
import { OpenAITransport } from "./OpenAITransport";
import { loadOpenAIConfig, openaiReady, type OpenAIConfig } from "./OpenAIConfig";
import { openAIUsageTracker } from "./OpenAIUsageTracker";
import { openAIErrorMapper } from "./OpenAIErrorMapper";

export class OpenAIProvider implements AIProvider {
  readonly id = "openai";

  constructor(
    private readonly transport = new OpenAITransport(),
    private readonly fallback = new MockProvider(),
    private readonly config: OpenAIConfig = loadOpenAIConfig(),
  ) {}

  ready() {
    return openaiReady(this.config);
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    writeAudit("OpenAIRequestStarted", "system", undefined, { provider: "openai" });
    if (!this.ready()) {
      writeAudit("OpenAIRequestFailed", "system", undefined, { reason: "disabled" });
      return this.fallback.chat(request);
    }
    try {
      const response = await this.transport.chat(request);
      openAIUsageTracker.add(response.usage);
      writeAudit("OpenAIRequestCompleted", "system", undefined, { tokens: response.usage.totalTokens });
      return response;
    } catch (error) {
      writeAudit("OpenAIRequestFailed", "system", undefined, { reason: "transport" });
      if (this.config.fallback) return this.fallback.chat(request);
      throw openAIErrorMapper.map(error);
    }
  }

  async *stream(request: ChatRequest): AsyncIterable<string> {
    if (!this.ready()) {
      yield* this.fallback.stream(request);
      return;
    }
    try {
      yield* this.transport.stream(request);
    } catch {
      if (this.config.fallback) {
        yield* this.fallback.stream(request);
        return;
      }
      throw openAIErrorMapper.map("stream");
    }
  }

  async embeddings(input: string[]): Promise<number[][]> {
    if (!this.ready()) return this.fallback.embeddings(input);
    try {
      return await this.transport.embeddings(input);
    } catch {
      if (this.config.fallback) return this.fallback.embeddings(input);
      throw openAIErrorMapper.map("embeddings");
    }
  }
}
