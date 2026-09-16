import { err, ok, type Result } from "@/src/types/platform";
import type { ChatRequest, ChatResponse } from "@/src/ai/types/provider";
import { OpenAIProvider } from "./OpenAIProvider";
import { openAIErrorMapper } from "./OpenAIErrorMapper";

export class OpenAIProviderService {
  constructor(private readonly provider = new OpenAIProvider()) {}

  async chat(request: ChatRequest): Promise<Result<ChatResponse>> {
    try {
      const data = await this.provider.chat(request);
      return ok(data);
    } catch (error) {
      return err(openAIErrorMapper.map(error).message);
    }
  }
}

export const openAIProviderService = new OpenAIProviderService();
