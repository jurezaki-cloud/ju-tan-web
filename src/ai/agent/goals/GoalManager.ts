import type { Goal, GoalHistoryEntry, GoalStatus } from "../types";

export class GoalManager {
  constructor(
    private readonly goals = new Map<string, Goal>(),
    private seq = 0,
    private readonly now: () => Date = () => new Date(),
  ) {}

  create(input: Omit<Goal, "id" | "createdAt" | "updatedAt" | "history" | "progress"> & { history?: GoalHistoryEntry[] }): Goal {
    const stamp = this.now().toISOString();
    const goal: Goal = {
      ...input,
      id: `goal-${++this.seq}`,
      progress: 0,
      history: input.history ?? [{ at: stamp, text: "Cilj ustvarjen." }],
      createdAt: stamp,
      updatedAt: stamp,
    };
    this.goals.set(goal.id, goal);
    return this.clone(goal);
  }

  get(id: string): Goal | undefined {
    const row = this.goals.get(id);
    return row ? this.clone(row) : undefined;
  }

  list(owner?: string): Goal[] {
    return [...this.goals.values()]
      .filter((item) => (owner ? item.owner === owner : true))
      .map((item) => this.clone(item));
  }

  setStatus(id: string, status: GoalStatus): Goal {
    const goal = this.require(id);
    goal.status = status;
    goal.updatedAt = this.now().toISOString();
    this.goals.set(id, goal);
    return this.clone(goal);
  }

  append(id: string, text: string): Goal {
    const goal = this.require(id);
    goal.history.push({ at: this.now().toISOString(), text });
    goal.updatedAt = this.now().toISOString();
    this.goals.set(id, goal);
    return this.clone(goal);
  }

  save(goal: Goal): Goal {
    goal.updatedAt = this.now().toISOString();
    this.goals.set(goal.id, { ...goal, steps: [...goal.steps], artifacts: [...goal.artifacts], history: [...goal.history] });
    return this.clone(goal);
  }

  private require(id: string): Goal {
    const goal = this.goals.get(id);
    if (!goal) throw new Error("Cilj ni najden.");
    return goal;
  }

  private clone(goal: Goal): Goal {
    return structuredClone(goal);
  }
}
