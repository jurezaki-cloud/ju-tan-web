import type { ActionEngine } from "@/src/ai/actions/ActionEngine";
import type { Action, ActionActor, ActionType } from "@/src/ai/actions/types";
import type { EventBus } from "@/src/ai/events/types";
import type { WorkflowDefinition, WorkflowRunResult, WorkflowStepResult } from "@/src/ai/types/workflow";
import { WorkflowError } from "@/src/ai/types/errors";
import { Planner } from "@/src/ai/planner/Planner";

const toolToType: Record<string, ActionType> = {
  "crm.createLead": "create-lead",
  "crm.findClient": "find-client",
  "crm.findLead": "find-lead",
  "crm.listOpenTasks": "list-open-tasks",
  "crm.listTasks": "list-open-tasks",
  "crm.listActivities": "list-activities",
  "crm.listQuotes": "list-quotes",
  "project.create": "create-project",
  "offer.generate": "create-offer",
  "invoice.generate": "create-invoice",
  "automation.run": "run-automation",
  "knowledge.search": "search-knowledge",
  "knowledge.prepareContext": "prepare-knowledge",
  "document.search": "search-documents",
  "document.read": "read-document",
  "document.summary": "summarize-document",
  "document.linkArtifact": "link-artifact",
  "file.linkArtifact": "link-artifact",
  "artifact.link": "link-artifact",
  "artifact.resolve": "resolve-artifact",
  "notification.prepare": "prepare-notification",
  "search.global": "global-search",
};

export class ActionWorkflowExecutor {
  constructor(
    private readonly actions: ActionEngine,
    private readonly definitions: Map<string, WorkflowDefinition>,
    private readonly planner: Planner = new Planner(),
    private readonly bus?: EventBus,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async run(
    workflowId: string,
    actor: ActionActor,
    input: Record<string, unknown> = {},
  ): Promise<WorkflowRunResult> {
    const definition = this.definitions.get(workflowId);
    if (!definition) throw new WorkflowError(workflowId, "Tok ni registriran.");

    const steps: WorkflowStepResult[] = [];
    let last: unknown = input;
    const created: Action[] = [];
    let halted = false;

    for (const step of definition.steps) {
      const type = (step.toolId && toolToType[step.toolId]) || this.planner.detect(step.label);
      const action = await this.actions.plan({
        command: step.label,
        type,
        actor: { ...actor, workflowId },
        input: { ...input, stepId: step.id },
      });
      const executed = await this.actions.execute(action.id);
      created.push(executed);
      last = executed.result ?? executed;
      steps.push({
        stepId: step.id,
        skipped: executed.status === "Cancelled",
        toolId: step.toolId,
        result: executed,
      });
      if (executed.status === "WaitingApproval" || executed.status === "Failed") {
        halted = true;
        break;
      }
    }

    const result: WorkflowRunResult = { workflowId, steps, result: last };
    if (!halted) {
      this.bus?.emit({
        type: "WorkflowCompleted",
        at: this.now().toISOString(),
        payload: { workflowId, actionIds: created.map((item) => item.id) },
      });
    }
    return result;
  }
}

export function defaultActionWorkflows(): WorkflowDefinition[] {
  return [
    {
      id: "sales.offer",
      title: "Nova ponudba",
      steps: [{ id: "plan", label: "Pripravi ponudbo za AI CRM" }],
    },
    {
      id: "project.open",
      title: "Odpri projekt",
      steps: [{ id: "create", label: "Ustvari projekt" }],
    },
  ];
}
