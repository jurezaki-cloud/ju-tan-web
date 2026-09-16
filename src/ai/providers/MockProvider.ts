import type { AIProvider, ChatRequest, ChatResponse } from "@/src/ai/types/provider";

function usage(prompt: number, completion: number) {
  return {
    promptTokens: prompt,
    completionTokens: completion,
    totalTokens: prompt + completion,
  };
}

export class MockProvider implements AIProvider {
  readonly id = "mock";

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const last = request.messages.at(-1)?.content ?? "";
    return {
      content: `Mock odgovor: ${last.slice(0, 180)}`,
      model: request.model ?? "mock-enterprise",
      usage: usage(request.messages.length * 12, 24),
    };
  }

  async *stream(request: ChatRequest): AsyncIterable<string> {
    const result = await this.chat(request);
    yield result.content;
  }

  async embeddings(input: string[]): Promise<number[][]> {
    return input.map((text) => {
      const vector = Array.from({ length: 8 }, (_, index) =>
        ((text.charCodeAt(index % text.length) || 0) % 13) / 13,
      );
      return vector;
    });
  }
}
