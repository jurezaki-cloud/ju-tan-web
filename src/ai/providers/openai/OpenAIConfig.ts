export type OpenAIConfig = {
  enabled: boolean;
  apiKey: string;
  model: string;
  embeddingModel: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  fallback: boolean;
};

export function loadOpenAIConfig(): OpenAIConfig {
  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  return {
    enabled: process.env.JU_TAN_OPENAI === "1",
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    baseUrl,
    timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? 20_000),
    maxRetries: 2,
    fallback: process.env.JU_TAN_OPENAI_FALLBACK !== "0",
  };
}

export function openaiReady(config = loadOpenAIConfig()) {
  return config.enabled && Boolean(config.apiKey) && Boolean(config.model) && Boolean(config.baseUrl);
}
