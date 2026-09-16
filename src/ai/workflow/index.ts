import { WorkflowError } from "@/src/ai/types/errors";
import type {
  WorkflowCondition,
  WorkflowDefinition,
  WorkflowRunResult,
  WorkflowStepResult,
} from "@/src/ai/types/workflow";
import type { ToolExecutor } from "@/src/ai/types/tool";

function matches(condition: WorkflowCondition | undefined, input: Record<string, unknown>): boolean {
  if (!condition) return true;
  const value = input[condition.field];
  if (condition.exists !== undefined) {
    return condition.exists ? value !== undefined : value === undefined;
  }
  if (condition.equals !== undefined) {
    return value === condition.equals;
  }
  return true;
}

export class WorkflowEngine {
  constructor(
    private readonly definitions: Map<string, WorkflowDefinition>,
    private readonly executor: ToolExecutor,
  ) {}

  get(id: string): WorkflowDefinition | undefined {
    return this.definitions.get(id);
  }

  async run(id: string, input: Record<string, unknown>): Promise<WorkflowRunResult> {
    const definition = this.definitions.get(id);
    if (!definition) throw new WorkflowError(id, "Tok ni registriran.");

    const steps: WorkflowStepResult[] = [];
    let last: unknown = input;

    for (const step of definition.steps) {
      if (!matches(step.condition, input)) {
        steps.push({ stepId: step.id, skipped: true, toolId: step.toolId });
        continue;
      }
      if (!step.toolId) {
        steps.push({ stepId: step.id, skipped: false, result: last });
        continue;
      }
      const result = await this.executor.run(step.toolId, input, { now: () => new Date() });
      last = result;
      steps.push({ stepId: step.id, skipped: false, toolId: step.toolId, result });
    }

    return { workflowId: id, steps, result: last };
  }
}

export function defaultWorkflows(): WorkflowDefinition[] {
  return [
    {
      id: "sales.lead-to-offer",
      title: "Stik do ponudbe",
      steps: [
        { id: "find", label: "Najdi stranko", toolId: "crm.findClient" },
        { id: "offer", label: "Ponudba", toolId: "offer.generate" },
      ],
    },
    {
      id: "support.ticket",
      title: "Odpri ticket",
      steps: [{ id: "create", label: "Ticket", toolId: "ticket.create" }],
    },
  ];
}
