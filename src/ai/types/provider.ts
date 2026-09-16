export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type ChatRole = "system" | "user" | "assistant";

export type ProviderChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: ProviderChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatResponse = {
  content: string;
  model: string;
  usage: TokenUsage;
};

export interface AIProvider {
  readonly id: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream(request: ChatRequest): AsyncIterable<string>;
  embeddings(input: string[]): Promise<number[][]>;
}
