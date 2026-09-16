import { createActionLayer, type CreateActionLayerOptions } from "@/src/ai/actions/createActionLayer";
import { createMemoryBundle } from "@/src/ai/memory";
import { MockMCPClientAdapter } from "@/src/ai/adapters/mcp";
import { DefaultKnowledgeProvider, MockReRanker, MockRetriever } from "@/src/ai/adapters/rag";
import type { PermissionService } from "@/src/identity/permissions/PermissionService";
import { GoalManager } from "./goals/GoalManager";
import { GoalPlanner } from "./planner";
import { ReasoningEngine } from "./reasoning";
import { AgentExecutor } from "./executor";
import { AgentController } from "./controller";
import { AgentStateMachine } from "./state";
import { AgentMemory } from "./memory";
import { ContextEngine } from "./context";
import { AgentEventBus } from "./observability";
import { MockScheduler } from "./scheduler";
import { ReflectionEngine } from "./reflection";
import { RecoveryEngine } from "./recovery";
import { DelegationService } from "./delegation";
import { AgentPolicy } from "./policies";
import type { AgentContext } from "./types";

export type CreateAgentOptions = CreateActionLayerOptions & {
  permissions?: PermissionService;
  context?: Partial<AgentContext>;
};

const defaultContext: AgentContext = {
  workspace: "sales",
  project: "ERP dokumenti",
  client: "Stranka 01",
  openDocuments: ["Pogodba-razvoj-2026.pdf"],
  knowledgeCollections: ["docs", "crm"],
};

export function createAgent(options: CreateAgentOptions = {}) {
  const layer = createActionLayer({
    engine: options.engine,
    policy: options.policy,
    integrations: options.integrations,
  });
  const memoryBundle = createMemoryBundle();
  const knowledge = new DefaultKnowledgeProvider(
    new MockRetriever(memoryBundle.knowledge),
    new MockReRanker(),
    memoryBundle.knowledge,
  );
  const bus = new AgentEventBus();
  const goals = new GoalManager();
  const reasoning = new ReasoningEngine();
  const planner = new GoalPlanner(layer.planner, reasoning, knowledge);
  const memory = new AgentMemory(memoryBundle);
  const scheduler = new MockScheduler();
  const delegation = new DelegationService(new MockMCPClientAdapter());
  const executor = new AgentExecutor(
    layer.actions,
    goals,
    memory,
    new ReflectionEngine(),
    new RecoveryEngine(),
    delegation,
    bus,
    new AgentPolicy(),
    layer.context,
  );
  const controller = new AgentController(
    goals,
    planner,
    executor,
    new AgentStateMachine(),
    memory,
    new ContextEngine({ ...defaultContext, ...options.context }),
    bus,
    scheduler,
    options.permissions,
  );
  return { controller, goals, layer, bus, memory, scheduler, knowledge, delegation };
}
