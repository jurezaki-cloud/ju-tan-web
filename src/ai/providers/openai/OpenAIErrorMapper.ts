import { ProviderError } from "@/src/ai/types/errors";

export class OpenAIErrorMapper {
  map(error: unknown, providerId = "openai"): ProviderError {
    const raw = error instanceof Error ? error.message : "Ponudnik ni na voljo.";
    const safe = raw.replace(/sk-[a-zA-Z0-9._-]+/g, "[redacted]").replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
    if (safe.includes("401") || safe.toLowerCase().includes("unauthorized")) {
      return new ProviderError(providerId, "Ponudnik ni na voljo.");
    }
    if (safe.includes("429")) return new ProviderError(providerId, "Ponudnik je zaseden. Poskusite znova.");
    if (safe.toLowerCase().includes("timeout")) return new ProviderError(providerId, "Zahteva je potekla.");
    return new ProviderError(providerId, "Zahteva ni uspela.");
  }
}

export const openAIErrorMapper = new OpenAIErrorMapper();
