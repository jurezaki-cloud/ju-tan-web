import type { AIEngine } from "@/src/ai/engine/AIEngine";
import type { ArtifactRecord } from "@/src/ai/types/artifact";
import type { EngineArtifactInput, EngineToolInput, EngineToolRunResult } from "@/src/ai/types/engine";
import { ActionError, ApprovalRequiredError } from "@/src/ai/actions/errors";
import type { Action, ExecutionLogEntry, PlanRequest } from "@/src/ai/actions/types";
import type { ActionStore } from "@/src/ai/actions/store";
import { InMemoryActionStore } from "@/src/ai/actions/store";
import { Planner } from "@/src/ai/planner/Planner";
import { ApprovalEngine } from "@/src/ai/approval/ApprovalEngine";
import { isGatedTool } from "@/src/ai/approval/policy";
import { JobRunner } from "@/src/ai/jobs/JobRunner";
import type { EventBus } from "@/src/ai/events/types";
import { InMemoryEventBus } from "@/src/ai/events/EventBus";
import type { ActionHistory } from "@/src/ai/history/ActionHistory";
import { InMemoryActionHistory } from "@/src/ai/history/ActionHistory";

export type ActionRuntime = {
  runTool(input: EngineToolInput): Promise<EngineToolRunResult>;
  generateArtifact(input: EngineArtifactInput): Promise<ArtifactRecord>;
};

export function runtimeFromEngine(engine: AIEngine): ActionRuntime {
  return {
    runTool: (input) => engine.runTool(input),
    generateArtifact: (input) => engine.generateArtifact(input),
  };
}

export type ActionEngineDeps = {
  runtime: ActionRuntime;
  planner?: Planner;
  approvals?: ApprovalEngine;
  jobs?: JobRunner;
  store?: ActionStore;
  bus?: EventBus;
  history?: ActionHistory;
  now?: () => Date;
  nextId?: () => string;
};

export class ActionEngine {
  private readonly planner: Planner;
  private readonly approvals: ApprovalEngine;
  private readonly jobs: JobRunner;
  private readonly store: ActionStore;
  private readonly bus: EventBus;
  private readonly history: ActionHistory;
  private readonly now: () => Date;
  private readonly nextId: () => string;
  private seq = 0;

  constructor(private readonly deps: ActionEngineDeps) {
    this.planner = deps.planner ?? new Planner();
    this.approvals = deps.approvals ?? new ApprovalEngine();
    this.jobs = deps.jobs ?? new JobRunner();
    this.store = deps.store ?? new InMemoryActionStore();
    this.bus = deps.bus ?? new InMemoryEventBus();
    this.history = deps.history ?? new InMemoryActionHistory();
    this.now = deps.now ?? (() => new Date());
    this.nextId = deps.nextId ?? (() => `act-${++this.seq}`);
  }

  async plan(request: PlanRequest): Promise<Action> {
    const planned = this.planner.plan(request);
    const stamp = this.now().toISOString();
    const action: Action = {
      id: this.nextId(),
      type: planned.type,
      title: planned.title,
      description: planned.description,
      category: planned.category,
      status: "Pending",
      priority: planned.type === "create-invoice" ? "high" : "normal",
      estimatedDuration: planned.estimatedDuration,
      requiresApproval: planned.requiresApproval,
      steps: planned.steps,
      artifactIds: [],
      actor: request.actor,
      command: request.command,
      payload: request.input ?? {},
      logs: [
        {
          at: stamp,
          message: "Plan pripravljen.",
          provider: request.actor.providerId,
        },
      ],
      createdAt: stamp,
      updatedAt: stamp,
      trace: { provider: request.actor.providerId },
    };
    await this.store.save(action);
    this.bus.emit({ type: "ActionCreated", at: stamp, actionId: action.id });
    return action;
  }

  async execute(actionId: string): Promise<Action> {
    const action = await this.require(actionId);
    if (action.status === "Cancelled") throw new ActionError("Akcija je preklicana.", actionId);
    if (action.status === "Completed") return action;

    if (action.status === "WaitingApproval") {
      const approval = await this.approvals.forAction(action.id);
      if (!this.approvals.isGranted(approval)) {
        throw new ApprovalRequiredError(action.id);
      }
    }

    return this.runSteps(action);
  }

  async cancel(actionId: string): Promise<Action> {
    const action = await this.require(actionId);
    if (action.status === "Completed") throw new ActionError("Zaključene akcije ni mogoče preklicati.", actionId);
    action.status = "Cancelled";
    if (action.jobId) await this.jobs.setStatus(action.jobId, "Cancelled", action.trace.durationMs ? 100 : 0);
    this.log(action, "Preklicano.");
    await this.persist(action);
    return action;
  }

  async retry(actionId: string): Promise<Action> {
    const action = await this.require(actionId);
    if (action.status !== "Failed") throw new ActionError("Ponovitev je mogoča samo za Failed.", actionId);
    action.steps = action.steps.map((step) =>
      step.status === "Failed" ? { ...step, status: "Pending", result: undefined } : step,
    );
    action.status = "Pending";
    action.error = undefined;
    this.log(action, "Ponovitev.");
    await this.persist(action);
    return this.execute(actionId);
  }

  async resume(actionId: string): Promise<Action> {
    const action = await this.require(actionId);
    if (action.status === "WaitingApproval") {
      const approval = await this.approvals.forAction(action.id);
      if (!this.approvals.isGranted(approval)) {
        throw new ApprovalRequiredError(action.id);
      }
      return this.execute(actionId);
    }
    if (action.status === "Failed") return this.retry(actionId);
    if (action.status === "Pending" || action.status === "Planning") return this.execute(actionId);
    return action;
  }

  async get(actionId: string): Promise<Action | undefined> {
    return this.store.get(actionId);
  }

  async list(filter?: { userId?: string; agentId?: string }): Promise<Action[]> {
    return this.store.list(filter);
  }

  private async runSteps(action: Action): Promise<Action> {
    const started = this.now();
    action.status = "Running";
    action.trace = {
      ...action.trace,
      startedAt: started.toISOString(),
      provider: action.actor.providerId,
    };
    const job = action.jobId ? await this.jobs.get(action.jobId) : await this.jobs.enqueue(action.id);
    if (job) {
      action.jobId = job.id;
      await this.jobs.setStatus(job.id, "Running", 5);
    }
    this.bus.emit({ type: "ActionStarted", at: started.toISOString(), actionId: action.id });
    this.log(action, "Izvajanje.", undefined, action.actor.providerId);
    await this.persist(action);

    try {
      const pending = action.steps.filter((step) => step.status === "Pending" || step.status === "Failed");
      let index = 0;
      for (const step of action.steps) {
        if (step.status === "Completed" || step.status === "Skipped") continue;
          const approval = await this.approvals.forAction(action.id);
          if (!this.approvals.isGranted(approval)) {
            if (isGatedTool(step.toolId)) {
              const requested = await this.approvals.request({
                actionId: action.id,
                title: `Odobritev: ${action.title}`,
                description: `Korak »${step.title}« zahteva odobritev (${step.toolId}). Delete, e-pošta, račun in plačilo se ne izvedejo brez potrditve.`,
              });
              step.status = "Blocked";
              action.status = "WaitingApproval";
              action.approvalId = requested.id;
              this.log(action, `Blokirano: ${step.toolId}`, step.toolId);
              await this.persist(action);
              if (action.jobId) await this.jobs.setStatus(action.jobId, "Queued", Math.max(job?.progress ?? 0, 10));
              return action;
            }
            if (step.requiresApproval) {
              const requested = await this.approvals.request({
                actionId: action.id,
                title: `Odobritev: ${action.title}`,
                description: `Korak »${step.title}« zahteva odobritev.`,
              });
              step.status = "Blocked";
              action.status = "WaitingApproval";
              action.approvalId = requested.id;
              this.log(action, `Blokirano: ${step.title}`);
              await this.persist(action);
              if (action.jobId) await this.jobs.setStatus(action.jobId, "Queued", Math.max(job?.progress ?? 0, 10));
              return action;
            }
          }

        step.status = "Running";
        await this.persist(action);
        const stepStarted = this.now();
        if (step.artifactKind) {
          const artifact = await this.deps.runtime.generateArtifact({
            kind: step.artifactKind,
            title: action.title,
            payload: action.payload,
          });
          step.result = { artifactId: artifact.id, format: artifact.format };
          action.artifactIds.push(artifact.id);
          this.bus.emit({
            type: "ArtifactCreated",
            at: this.now().toISOString(),
            actionId: action.id,
            payload: { artifactId: artifact.id },
          });
        } else if (step.toolId) {
          const result = await this.deps.runtime.runTool({
            toolId: step.toolId,
            input: { ...action.payload, command: action.command },
            conversationId: String(action.payload.conversationId ?? action.id),
            projectId: typeof action.payload.projectId === "string" ? action.payload.projectId : undefined,
            clientId: typeof action.payload.clientId === "string" ? action.payload.clientId : undefined,
          });
          if (!result.ok) throw new ActionError(result.error ?? "Orodje ni uspelo.", action.id);
          step.result = result.data;
          action.trace.tool = step.toolId;
          action.trace.durationMs = (action.trace.durationMs ?? 0) + result.durationMs;
        }
        step.status = "Completed";
        const durationMs = this.now().getTime() - stepStarted.getTime();
        this.log(action, `Korak ${step.title} zaključen.`, step.toolId, action.actor.providerId, durationMs);
        index += 1;
        if (action.jobId) {
          await this.jobs.setStatus(action.jobId, "Running", Math.round(((index + 1) / Math.max(pending.length, 1)) * 90));
        }
      }

      const finished = this.now();
      action.status = "Completed";
      action.result = { artifactIds: action.artifactIds, steps: action.steps.map((step) => step.id) };
      action.trace.finishedAt = finished.toISOString();
      action.trace.durationMs = finished.getTime() - started.getTime();
      this.log(action, "Zaključeno.", action.trace.tool, action.actor.providerId, action.trace.durationMs);
      this.bus.emit({
        type: "ActionCompleted",
        at: finished.toISOString(),
        actionId: action.id,
        payload: { durationMs: action.trace.durationMs },
      });
      if (action.jobId) await this.jobs.setStatus(action.jobId, "Completed", 100);
      await this.history.append({
        id: `hist-${action.id}`,
        actionId: action.id,
        at: finished.toISOString(),
        userId: action.actor.userId,
        agentId: action.actor.agentId,
        durationMs: action.trace.durationMs,
        result: action.result,
        artifactIds: action.artifactIds,
        status: action.status,
      });
      await this.persist(action);
      return action;
    } catch (error) {
      const finished = this.now();
      action.status = "Failed";
      action.error = error instanceof Error ? error.message : "Izvedba ni uspela.";
      action.trace.finishedAt = finished.toISOString();
      action.trace.durationMs = finished.getTime() - started.getTime();
      const current = action.steps.find((step) => step.status === "Running");
      if (current) current.status = "Failed";
      this.log(action, action.error, current?.toolId, action.actor.providerId, action.trace.durationMs);
      this.bus.emit({
        type: "ActionFailed",
        at: finished.toISOString(),
        actionId: action.id,
        payload: { error: action.error },
      });
      if (action.jobId) await this.jobs.setStatus(action.jobId, "Failed", 0, action.error);
      await this.history.append({
        id: `hist-${action.id}`,
        actionId: action.id,
        at: finished.toISOString(),
        userId: action.actor.userId,
        agentId: action.actor.agentId,
        durationMs: action.trace.durationMs,
        result: action.error,
        artifactIds: action.artifactIds,
        status: action.status,
      });
      await this.persist(action);
      return action;
    }
  }

  private log(
    action: Action,
    message: string,
    tool?: string,
    provider?: string,
    durationMs?: number,
  ): void {
    const entry: ExecutionLogEntry = {
      at: this.now().toISOString(),
      message,
      tool,
      provider,
      durationMs,
    };
    action.logs.push(entry);
  }

  private async persist(action: Action): Promise<void> {
    action.updatedAt = this.now().toISOString();
    await this.store.save(action);
  }

  private async require(actionId: string): Promise<Action> {
    const action = await this.store.get(actionId);
    if (!action) throw new ActionError("Akcija ni najdena.", actionId);
    return action;
  }
}
