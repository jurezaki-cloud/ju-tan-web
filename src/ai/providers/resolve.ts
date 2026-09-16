import type { AIProvider } from "@/src/ai/types/provider";
import { MockProvider } from "./MockProvider";
import { openaiReady } from "./openai/OpenAIConfig";
import { OpenAIProvider } from "./openai/OpenAIProvider";

export function resolveAIProvider(): AIProvider {
  try {
    if (openaiReady()) return new OpenAIProvider();
  } catch {
    return new MockProvider();
  }
  return new MockProvider();
}
