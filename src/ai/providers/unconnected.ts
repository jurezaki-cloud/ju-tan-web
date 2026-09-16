import { ProviderError } from "@/src/ai/types/errors";
import type { AIProvider, ChatRequest, ChatResponse } from "@/src/ai/types/provider";

export class UnconnectedProvider implements AIProvider {
  constructor(readonly id: string) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    void request;
    throw new ProviderError(this.id, "Ponudnik ni priklopljen.");
  }

  async *stream(request: ChatRequest): AsyncIterable<string> {
    void request;
    throw new ProviderError(this.id, "Streaming ni priklopljen.");
  }

  async embeddings(input: string[]): Promise<number[][]> {
    void input;
    throw new ProviderError(this.id, "Embeddings niso priklopljeni.");
  }
}

export class AzureOpenAIProvider extends UnconnectedProvider {
  constructor() {
    super("azure-openai");
  }
}

export class AnthropicProvider extends UnconnectedProvider {
  constructor() {
    super("anthropic");
  }
}

export class GeminiProvider extends UnconnectedProvider {
  constructor() {
    super("google-gemini");
  }
}

export class LocalLLMProvider extends UnconnectedProvider {
  constructor() {
    super("local");
  }
}
