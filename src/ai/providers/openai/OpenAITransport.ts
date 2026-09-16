import type { ChatRequest, ChatResponse } from "@/src/ai/types/provider";
import { loadOpenAIConfig, openaiReady, type OpenAIConfig } from "./OpenAIConfig";
import { openAIMessageMapper } from "./OpenAIMessageMapper";
import { openAIResponseNormalizer } from "./OpenAIResponseNormalizer";
import { openAIErrorMapper } from "./OpenAIErrorMapper";

export type OpenAITransportFetch = typeof fetch;

export class OpenAITransport {
  constructor(
    private readonly config: OpenAIConfig = loadOpenAIConfig(),
    private readonly fetcher: OpenAITransportFetch = fetch,
  ) {}

  ready() {
    return openaiReady(this.config);
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const json = (await this.post("/chat/completions", {
      model: request.model ?? this.config.model,
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens ?? 800,
      messages: openAIMessageMapper.toOpenAI(request.messages),
      stream: false,
    })) as Parameters<typeof openAIResponseNormalizer.chat>[0];
    return openAIResponseNormalizer.chat(json, request.model ?? this.config.model);
  }

  async *stream(request: ChatRequest): AsyncIterable<string> {
    const response = await this.request("/chat/completions", {
      model: request.model ?? this.config.model,
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens ?? 800,
      messages: openAIMessageMapper.toOpenAI(request.messages),
      stream: true,
    });
    const body = response.body;
    if (!body) return;
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data) as Parameters<typeof openAIResponseNormalizer.delta>[0];
          const delta = openAIResponseNormalizer.delta(json);
          if (delta) yield delta;
        } catch {
          continue;
        }
      }
    }
  }

  async embeddings(input: string[]): Promise<number[][]> {
    const json = (await this.post("/embeddings", {
      model: this.config.embeddingModel,
      input,
    })) as { data?: { embedding?: number[] }[] };
    return (json.data ?? []).map((item) => item.embedding ?? []);
  }

  private async post(path: string, body: Record<string, unknown>) {
    const response = await this.request(path, body);
    const json = (await response.json()) as { error?: { message?: string } };
    if (!response.ok) throw new Error(json.error?.message ?? `openai ${response.status}`);
    return json;
  }

  private async request(path: string, body: Record<string, unknown>) {
    if (!this.ready()) throw new Error("disabled");
    let last: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt += 1) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
        const response = await this.fetcher(`${this.config.baseUrl}${path}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (response.status === 429 || response.status >= 500) {
          last = new Error(`openai ${response.status}`);
          continue;
        }
        return response;
      } catch (error) {
        last = error;
      }
    }
    throw openAIErrorMapper.map(last);
  }
}
