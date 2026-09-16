import type { MemoryBundle } from "@/src/ai/types/memory";
import type { Goal, Reflection } from "../types";

export class AgentMemory {
  constructor(
    private readonly bundle: MemoryBundle,
    private readonly goals: Goal[] = [],
    private readonly reflections: Reflection[] = [],
    private readonly recentActionIds: string[] = [],
    private readonly artifactIds: string[] = [],
  ) {}

  conversation() {
    return this.bundle.conversation;
  }

  session() {
    return this.bundle.session;
  }

  project() {
    return this.bundle.project;
  }

  client() {
    return this.bundle.client;
  }

  knowledge() {
    return this.bundle.knowledge;
  }

  rememberGoal(goal: Goal): void {
    this.goals.push(goal);
  }

  rememberAction(id: string): void {
    this.recentActionIds.push(id);
  }

  rememberArtifact(id: string): void {
    this.artifactIds.push(id);
  }

  rememberReflection(item: Reflection): void {
    this.reflections.push(item);
  }

  snapshot() {
    return {
      goals: [...this.goals],
      reflections: [...this.reflections],
      recentActionIds: [...this.recentActionIds],
      artifactIds: [...this.artifactIds],
    };
  }
}
