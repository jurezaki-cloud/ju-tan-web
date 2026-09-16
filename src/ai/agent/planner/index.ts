import type { Planner } from "@/src/ai/planner/Planner";
import type { KnowledgeProvider } from "@/src/ai/types/rag";
import type { GoalStep, SkillId } from "../types";
import { agentSkills, skillById } from "../skills";
import { ReasoningEngine } from "../reasoning";

const commandToSkill: { match: RegExp; skill: SkillId }[] = [
  { match: /ponudb|offer/i, skill: "create-offer" },
  { match: /audit|splet|website/i, skill: "website-audit" },
  { match: /crm|stik|pipeline/i, skill: "crm-analysis" },
  { match: /repo/i, skill: "repository-review" },
  { match: /api/i, skill: "generate-api" },
  { match: /sql/i, skill: "generate-sql" },
  { match: /pdf/i, skill: "generate-pdf" },
  { match: /kampanj|marketing/i, skill: "marketing-campaign" },
  { match: /integrac/i, skill: "integration-analysis" },
  { match: /analiza|business/i, skill: "business-analysis" },
];

export class GoalPlanner {
  constructor(
    private readonly actionsPlanner: Planner,
    private readonly reasoning: ReasoningEngine,
    private readonly knowledge?: KnowledgeProvider,
  ) {}

  detectSkill(command: string): SkillId {
    return commandToSkill.find((item) => item.match.test(command))?.skill ?? "business-analysis";
  }

  async plan(command: string): Promise<{
    skillId: SkillId;
    actionType: ReturnType<Planner["detect"]>;
    knowledge: string;
    steps: GoalStep[];
    title: string;
    description: string;
    eta: string;
  }> {
    const skillId = this.detectSkill(command);
    const skill = skillById(skillId) ?? agentSkills[0];
    const actionType = this.actionsPlanner.detect(command);
    const knowledge = this.knowledge ? await this.knowledge.prepareContext(command) : "";
    const actionPlan = this.actionsPlanner.plan({
      command,
      type: actionType,
      actor: { userId: "agent", agentId: skill.delegate ?? "sales", providerId: "mock" },
    });
    const steps: GoalStep[] = actionPlan.steps.map((step, index) => ({
      id: `gstep-${index + 1}`,
      title: step.title,
      skillId,
      delegate: skill.delegate,
      reasoning: this.reasoning.explain(step.title, skill.name),
      status: "Pending",
    }));
    return {
      skillId,
      actionType,
      knowledge,
      steps,
      title: skill.name,
      description: `${skill.description} Ukaz: ${command}`,
      eta: skill.estimatedDuration,
    };
  }
}
