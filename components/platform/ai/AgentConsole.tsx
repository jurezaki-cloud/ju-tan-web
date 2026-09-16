import GoalPanel from "./GoalPanel";
import ReasoningPanel from "./ReasoningPanel";
import ExecutionTimeline from "./ExecutionTimeline";
import ReflectionCard from "./ReflectionCard";
import RecoveryCard from "./RecoveryCard";
import DelegationCard from "./DelegationCard";
import {
  mockDelegation,
  mockExecution,
  mockGoal,
  mockReasoning,
  mockRecovery,
  mockReflection,
} from "@/src/ai/agent/mock";

export default function AgentConsole() {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3" aria-label="Executive Agent">
      <GoalPanel goal={mockGoal} />
      <ReasoningPanel thinking={mockReasoning} />
      <ExecutionTimeline phases={mockExecution} />
      <ReflectionCard reflection={mockReflection} />
      <RecoveryCard recovery={mockRecovery} />
      <DelegationCard delegation={mockDelegation} />
    </section>
  );
}
