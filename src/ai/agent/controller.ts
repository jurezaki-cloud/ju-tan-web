import { Permission } from "@/src/config/permissions";
import type { ActionActor } from "@/src/ai/actions/types";
import type { PermissionService } from "@/src/identity/permissions/PermissionService";
import type { Role } from "@/src/config/roles";
import { ActionError } from "@/src/ai/actions/errors";
import type { AgentContext, Goal, StreamChunk } from "./types";
import { GoalManager } from "./goals/GoalManager";
import { GoalPlanner } from "./planner";
import { AgentExecutor } from "./executor";
import { AgentStateMachine } from "./state";
import { AgentMemory } from "./memory";
import { ContextEngine } from "./context";
import { AgentEventBus } from "./observability";
import { MockScheduler } from "./scheduler";
import type { ScheduleKind } from "./types";

export class AgentController {
  constructor(
    private readonly goals: GoalManager,
    private readonly planner: GoalPlanner,
    private readonly executor: AgentExecutor,
    private readonly state: AgentStateMachine,
    private readonly memory: AgentMemory,
    private readonly context: ContextEngine,
    private readonly bus: AgentEventBus,
    private readonly scheduler: MockScheduler,
    private readonly permissions?: PermissionService,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async interpret(command: string, owner: string): Promise<Goal> {
    this.assertAi(this.context.get().role);
    this.state.transition("Planning");
    this.bus.emit({ type: "PlanningStarted", at: this.now().toISOString() });
    const planned = await this.planner.plan(command);
    this.bus.emit({ type: "PlanningFinished", at: this.now().toISOString() });
    this.state.transition("Reasoning");
    this.bus.emit({ type: "ReasoningStarted", at: this.now().toISOString() });
    const ctx = this.context.get();
    const goal = this.goals.create({
      title: planned.title,
      description: planned.description,
      priority: "high",
      status: "Active",
      owner,
      workspace: ctx.workspace,
      remaining: planned.steps.length + " korakov",
      eta: planned.eta,
      steps: planned.steps,
      artifacts: [],
      command,
    });
    this.memory.rememberGoal(goal);
    this.bus.emit({ type: "GoalCreated", at: this.now().toISOString(), goalId: goal.id });
    this.bus.emit({ type: "ReasoningFinished", at: this.now().toISOString(), goalId: goal.id });
    this.state.transition("Idle");
    return goal;
  }

  async run(goalId: string, actor: ActionActor) {
    this.assertAi(this.context.get().role);
    const goal = this.goals.get(goalId);
    if (!goal) throw new ActionError("Cilj ni najden.");
    this.state.transition("Running");
    const result = await this.executor.run(goal, actor);
    if (result.goal.status === "WaitingApproval") this.state.transition("WaitingApproval");
    else if (result.goal.status === "Failed") this.state.transition("Failed");
    else if (result.goal.status === "Completed") this.state.transition("Completed");
    else this.state.transition("Idle");
    return result;
  }

  async *stream(command: string, owner: string, actor: ActionActor): AsyncIterable<StreamChunk> {
    const goal = await this.interpret(command, owner);
    yield { phase: "Planner", message: "Plan pripravljen.", goalId: goal.id };
    yield { phase: "Reasoning", message: goal.steps[0]?.reasoning.reason ?? "Razlaga korakov.", goalId: goal.id };
    const result = await this.run(goal.id, actor);
    yield { phase: "Execution", message: result.action?.status ?? result.goal.status, goalId: goal.id };
    yield { phase: "Artifacts", message: String(result.goal.artifacts.length), goalId: goal.id };
    yield { phase: "Reflection", message: result.reflection?.improve ?? "", goalId: goal.id };
    yield { phase: "Finish", message: result.goal.status, goalId: goal.id };
  }

  pause(goalId: string) {
    this.state.transition("Paused");
    return this.goals.setStatus(goalId, "Paused");
  }

  cancel(goalId: string) {
    this.state.transition("Cancelled");
    this.bus.emit({ type: "GoalCancelled", at: this.now().toISOString(), goalId });
    return this.goals.setStatus(goalId, "Cancelled");
  }

  schedule(goalId: string, kind: ScheduleKind) {
    return this.scheduler.schedule(goalId, kind);
  }

  currentState() {
    return this.state.get();
  }

  contextSnapshot(): AgentContext {
    return this.context.get();
  }

  private assertAi(role?: string) {
    if (!this.permissions || !role) return;
    if (!this.permissions.can(role as Role, Permission.AI)) {
      throw new ActionError("Ni dovoljenja za AI agenta.");
    }
  }
}
