import type { AgentState } from "../types";

export class AgentStateMachine {
  private state: AgentState = "Idle";

  get(): AgentState {
    return this.state;
  }

  transition(next: AgentState): AgentState {
    this.state = next;
    return this.state;
  }
}
