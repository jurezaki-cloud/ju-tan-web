import type { ActionEngine } from "@/src/ai/actions/ActionEngine";
import type { Action, ActionActor } from "@/src/ai/actions/types";
import { skillById } from "../skills";
import type { DelegationRecord, Goal, RecoveryRecord, Reflection } from "../types";
import type { GoalManager } from "../goals/GoalManager";
import type { AgentMemory } from "../memory";
import type { ReflectionEngine } from "../reflection";
import type { RecoveryEngine } from "../recovery";
import type { DelegationService } from "../delegation";
import type { AgentEventBus } from "../observability";
import type { AgentPolicy } from "../policies";
import type { ContextBuilder } from "@/src/ai/context/ContextBuilder";

export type ExecuteResult = {
  goal: Goal;
  action?: Action;
  reflection?: Reflection;
  recovery?: RecoveryRecord;
  delegation?: DelegationRecord;
};

export class AgentExecutor {
  constructor(
    private readonly actions: ActionEngine,
    private readonly goals: GoalManager,
    private readonly memory: AgentMemory,
    private readonly reflection: ReflectionEngine,
    private readonly recovery: RecoveryEngine,
    private readonly delegation: DelegationService,
    private readonly bus: AgentEventBus,
    private readonly policy: AgentPolicy,
    private readonly contextBuilder?: ContextBuilder,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async run(goal: Goal, actor: ActionActor): Promise<ExecuteResult> {
    const skill = skillById(goal.steps[0]?.skillId ?? "create-offer");
    const delegation = this.delegation.start(goal.id, skill?.delegate ?? "sales", goal.title);
    this.bus.emit({
      type: "DelegationStarted",
      at: this.now().toISOString(),
      goalId: goal.id,
      payload: { agent: delegation.agent },
    });

    const snapshot = this.contextBuilder
      ? await this.contextBuilder.build({
          query: goal.command,
          workspace: goal.workspace,
          userId: actor.userId,
        })
      : undefined;
    const action = await this.actions.plan({
      command: goal.command,
      actor,
      input: {
        goalId: goal.id,
        clientId: snapshot?.client?.id,
        projectId: snapshot?.project?.id,
        context: snapshot?.mergedText,
      },
    });

    for (const step of action.steps) {
      if (this.policy.alwaysApproval(step.toolId) && step.requiresApproval) {
        break;
      }
    }

    const executed = await this.actions.execute(action.id);
    this.memory.rememberAction(executed.id);
    executed.artifactIds.forEach((id) => this.memory.rememberArtifact(id));

    const working = this.goals.get(goal.id) ?? goal;
    working.artifacts = [...new Set([...working.artifacts, ...executed.artifactIds])];

    if (executed.status === "WaitingApproval") {
      working.status = "WaitingApproval";
      working.progress = 70;
      working.remaining = "Odobritev e-pošte";
      this.markSteps(working, "Blocked", executed.steps.find((item) => item.status === "Blocked")?.title);
      this.goals.save(working);
      this.delegation.finish(delegation.id, "Running");
      const reflection = this.reflection.evaluate(working.id, "approval", false, "Čakanje na odobritev. Approval se ne obide.");
      this.memory.rememberReflection(reflection);
      this.bus.emit({ type: "ReflectionCompleted", at: this.now().toISOString(), goalId: working.id });
      return { goal: working, action: executed, reflection, delegation };
    }

    if (executed.status === "Failed") {
      working.status = "Failed";
      this.bus.emit({ type: "RecoveryStarted", at: this.now().toISOString(), goalId: working.id });
      let recovery = this.recovery.start(working.id, executed.error ?? "Orodje ni uspelo.");
      recovery = this.recovery.next(recovery);
      this.bus.emit({ type: "RecoveryFinished", at: this.now().toISOString(), goalId: working.id });
      const reflection = this.reflection.evaluate(working.id, undefined, false, recovery.error);
      this.memory.rememberReflection(reflection);
      this.goals.save(working);
      this.delegation.finish(delegation.id, "Failed");
      return { goal: working, action: executed, reflection, recovery, delegation };
    }

    working.status = "Completed";
    working.progress = 100;
    working.remaining = "0";
    working.steps = working.steps.map((step) => ({ ...step, status: "Completed" }));
    this.goals.save(working);
    this.goals.setStatus(working.id, "Completed");
    this.delegation.finish(delegation.id, "Completed");
    this.bus.emit({ type: "DelegationFinished", at: this.now().toISOString(), goalId: working.id });
    this.bus.emit({ type: "GoalCompleted", at: this.now().toISOString(), goalId: working.id });
    const reflection = this.reflection.evaluate(working.id, undefined, true, "Cilj zaključen.");
    this.memory.rememberReflection(reflection);
    this.bus.emit({ type: "ReflectionCompleted", at: this.now().toISOString(), goalId: working.id });
    return { goal: this.goals.get(working.id) ?? working, action: executed, reflection, delegation };
  }

  private markSteps(goal: Goal, status: Goal["steps"][number]["status"], blockedTitle?: string): void {
    goal.steps = goal.steps.map((step) => {
      if (blockedTitle && step.title === blockedTitle) return { ...step, status };
      if (status === "Blocked" && step.title !== blockedTitle) return { ...step, status: step.status === "Pending" ? "Completed" : step.status };
      return step;
    });
  }
}
