import { createEngine } from "@/src/ai/engine/createEngine";
import type { AIEngine } from "@/src/ai/engine/AIEngine";
import { Planner } from "@/src/ai/planner/Planner";
import { ApprovalEngine } from "@/src/ai/approval/ApprovalEngine";
import type { ApprovalPolicy } from "@/src/ai/approval/policy";
import { DefaultApprovalPolicy } from "@/src/ai/approval/policy";
import { InMemoryApprovalStore } from "@/src/ai/approval/store";
import { JobRunner } from "@/src/ai/jobs/JobRunner";
import { InMemoryEventBus } from "@/src/ai/events/EventBus";
import { InMemoryActionHistory } from "@/src/ai/history/ActionHistory";
import { InMemoryActionStore } from "@/src/ai/actions/store";
import { ActionEngine, runtimeFromEngine } from "@/src/ai/actions/ActionEngine";
import type { ActionRuntime } from "@/src/ai/actions/ActionEngine";
import { ActionWorkflowExecutor, defaultActionWorkflows } from "@/src/ai/execution/ActionWorkflowExecutor";
import { DefaultToolExecutor, InMemoryToolRegistry } from "@/src/ai/registry";
import { createDataTools } from "@/src/ai/tools/dataLayer";
import { createMockIntegrations } from "@/src/integrations/createMockIntegrations";
import type { IntegrationBundle } from "@/src/types/integrations";
import { ContextBuilder } from "@/src/ai/context/ContextBuilder";

export type CreateActionLayerOptions = {
  engine?: AIEngine;
  policy?: ApprovalPolicy;
  integrations?: IntegrationBundle;
};

export function createActionLayer(options: CreateActionLayerOptions = {}) {
  const integrations = options.integrations ?? createMockIntegrations();
  const engine = options.engine ?? createEngine();
  const policy = options.policy ?? new DefaultApprovalPolicy();
  const bus = new InMemoryEventBus();
  const planner = new Planner(policy);
  const approvals = new ApprovalEngine(new InMemoryApprovalStore(), policy, bus);
  const extra = new InMemoryToolRegistry();
  createDataTools(integrations).forEach((tool) => extra.register(tool));
  const extraExecutor = new DefaultToolExecutor(extra);
  const base = runtimeFromEngine(engine);
  const runtime: ActionRuntime = {
    async runTool(input) {
      if (extra.get(input.toolId)) {
        const started = Date.now();
        const payload = {
          ...input.input,
          query: input.input.query ?? input.input.command,
          name: input.input.name ?? input.input.command,
          title: input.input.title ?? input.input.command,
          body: input.input.body ?? input.input.context ?? input.input.command,
          content: input.input.content ?? input.input.context ?? input.input.command,
          id: input.input.id ?? input.input.documentId ?? input.input.clientId,
          documentId: input.input.documentId ?? input.input.id,
          artifactId: input.input.artifactId ?? input.input.id,
          clientId: input.input.clientId ?? input.clientId,
        };
        const value = await extraExecutor.run(input.toolId, payload, {
          conversationId: input.conversationId,
          projectId: input.projectId,
          clientId: input.clientId,
          now: () => new Date(),
        });
        return { ...value, toolId: input.toolId, durationMs: Date.now() - started };
      }
      return base.runTool(input);
    },
    generateArtifact: (input) => base.generateArtifact(input),
  };
  const actions = new ActionEngine({
    runtime,
    planner,
    approvals,
    jobs: new JobRunner(),
    store: new InMemoryActionStore(),
    bus,
    history: new InMemoryActionHistory(),
  });
  const workflows = new ActionWorkflowExecutor(
    actions,
    new Map(defaultActionWorkflows().map((item) => [item.id, item])),
    planner,
    bus,
  );
  const context = new ContextBuilder(integrations);
  return { engine, actions, approvals, planner, workflows, bus, integrations, context };
}
