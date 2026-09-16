import type { AiEngineConfig } from "@/src/ai/types/config";
import type {
  EngineArtifactInput,
  EngineChatInput,
  EngineChatResult,
  EngineRequest,
  EngineResult,
  EngineToolInput,
  EngineToolRunResult,
  EngineWorkflowInput,
} from "@/src/ai/types/engine";
import type { MemoryBundle } from "@/src/ai/types/memory";
import type { AIProvider } from "@/src/ai/types/provider";
import type { KnowledgeProvider } from "@/src/ai/types/rag";
import type { ToolContext, ToolExecutor } from "@/src/ai/types/tool";
import type { WorkflowRunResult } from "@/src/ai/types/workflow";
import type { ArtifactRecord } from "@/src/ai/types/artifact";
import type { AuditLog, Logger } from "@/src/ai/types/observability";
import { ArtifactFactory, parseArtifactFormat } from "@/src/ai/artifacts";
import { toolExecution, timed, nowIso } from "@/src/ai/observability";
import type { WorkflowEngine } from "@/src/ai/workflow";

export type AIEngineDeps = {
  config: AiEngineConfig;
  provider: AIProvider;
  executor: ToolExecutor;
  memory: MemoryBundle;
  workflows: WorkflowEngine;
  artifacts: ArtifactFactory;
  knowledge: KnowledgeProvider;
  logger: Logger;
  audit: AuditLog;
};

export class AIEngine {
  constructor(private readonly deps: AIEngineDeps) {}

  async execute(request: EngineRequest): Promise<EngineResult> {
    switch (request.kind) {
      case "chat":
        return { kind: "chat", output: await this.chat(request.chat) };
      case "tool":
        return { kind: "tool", output: await this.runTool(request.tool) };
      case "workflow":
        return { kind: "workflow", output: await this.runWorkflow(request.workflow) };
      case "artifact":
        return { kind: "artifact", output: await this.generateArtifact(request.artifact) };
    }
  }

  async chat(input: EngineChatInput): Promise<EngineChatResult> {
    const history = await this.deps.memory.conversation.list(input.conversationId);
    const lastUser = [...input.messages].reverse().find((message) => message.role === "user")?.content ?? "";
    const rag = lastUser ? await this.deps.knowledge.prepareContext(lastUser) : "";
    const system = [input.systemPrompt, rag].filter(Boolean).join("\n\n");
    const messages = [
      ...(system ? [{ role: "system" as const, content: system }] : []),
      ...history,
      ...input.messages,
    ];

    const response = await this.deps.provider.chat({
      messages,
      model: input.model ?? this.deps.config.model.id,
      temperature: this.deps.config.model.temperature,
      maxTokens: this.deps.config.model.maxTokens,
    });

    for (const message of input.messages) {
      await this.deps.memory.conversation.append(input.conversationId, message);
    }
    await this.deps.memory.conversation.append(input.conversationId, {
      role: "assistant",
      content: response.content,
    });

    this.deps.audit.record({
      type: "chat",
      at: nowIso(),
      payload: {
        conversationId: input.conversationId,
        tokens: response.usage.totalTokens,
        provider: this.deps.provider.id,
      },
    });
    this.deps.logger.info("chat", { conversationId: input.conversationId });

    return { ...response, conversationId: input.conversationId };
  }

  async runTool(input: EngineToolInput): Promise<EngineToolRunResult> {
    const context: ToolContext = {
      conversationId: input.conversationId,
      projectId: input.projectId,
      clientId: input.clientId,
      now: () => new Date(),
    };
    const { value, durationMs } = await timed(() =>
      this.deps.executor.run(input.toolId, input.input, context),
    );
    const record = toolExecution(input.toolId, durationMs, value.ok, value.error);
    this.deps.audit.record({
      type: "tool",
      at: record.startedAt,
      payload: { ...record },
    });
    return { ...value, toolId: input.toolId, durationMs };
  }

  async runWorkflow(input: EngineWorkflowInput): Promise<WorkflowRunResult> {
    const result = await this.deps.workflows.run(input.workflowId, input.input);
    this.deps.audit.record({
      type: "workflow",
      at: nowIso(),
      payload: { workflowId: result.workflowId },
    });
    return result;
  }

  async generateArtifact(input: EngineArtifactInput): Promise<ArtifactRecord> {
    const format = parseArtifactFormat(input.kind);
    const artifact = this.deps.artifacts.create(format, input.title, input.payload);
    this.deps.audit.record({
      type: "artifact",
      at: nowIso(),
      payload: { format: artifact.format, id: artifact.id },
    });
    return artifact;
  }
}
