import type { AiEngineConfig } from "@/src/ai/types/config";
import type { AIProvider } from "@/src/ai/types/provider";
import type { MemoryBundle } from "@/src/ai/types/memory";
import type { KnowledgeProvider } from "@/src/ai/types/rag";
import type { Logger, AuditLog } from "@/src/ai/types/observability";
import { resolveAIProvider } from "@/src/ai/providers/resolve";
import { DefaultToolExecutor, InMemoryToolRegistry } from "@/src/ai/registry";
import { registerDefaultTools } from "@/src/ai/tools";
import { createMemoryBundle } from "@/src/ai/memory";
import { WorkflowEngine, defaultWorkflows } from "@/src/ai/workflow";
import { ArtifactFactory } from "@/src/ai/artifacts";
import {
  DefaultKnowledgeProvider,
  MockReRanker,
  MockRetriever,
} from "@/src/ai/adapters";
import { ConsoleLogger, InMemoryAuditLog } from "@/src/ai/observability";
import { AIEngine } from "./AIEngine";

export const defaultEngineConfig: AiEngineConfig = {
  provider: { id: process.env.JU_TAN_OPENAI === "1" ? "openai" : "mock", model: process.env.OPENAI_MODEL ?? "mock-enterprise" },
  model: {
    id: process.env.OPENAI_MODEL ?? "mock-enterprise",
    providerId: process.env.JU_TAN_OPENAI === "1" ? "openai" : "mock",
    temperature: 0.3,
    maxTokens: 800,
  },
  workflow: { defaultWorkflowId: "sales.lead-to-offer" },
};

export type CreateEngineOptions = {
  config?: AiEngineConfig;
  provider?: AIProvider;
  memory?: MemoryBundle;
  knowledge?: KnowledgeProvider;
  logger?: Logger;
  audit?: AuditLog;
};

export function createEngine(options: CreateEngineOptions = {}): AIEngine {
  const config = options.config ?? defaultEngineConfig;
  const provider = options.provider ?? resolveAIProvider();
  const memory = options.memory ?? createMemoryBundle();
  const registry = new InMemoryToolRegistry();
  registerDefaultTools(registry);
  const executor = new DefaultToolExecutor(registry);
  const workflows = new WorkflowEngine(
    new Map(defaultWorkflows().map((item) => [item.id, item])),
    executor,
  );
  const knowledge =
    options.knowledge ??
    new DefaultKnowledgeProvider(new MockRetriever(memory.knowledge), new MockReRanker(), memory.knowledge);

  return new AIEngine({
    config,
    provider,
    executor,
    memory,
    workflows,
    artifacts: new ArtifactFactory(),
    knowledge,
    logger: options.logger ?? new ConsoleLogger(),
    audit: options.audit ?? new InMemoryAuditLog(),
  });
}
