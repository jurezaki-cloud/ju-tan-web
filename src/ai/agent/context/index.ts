import type { AgentContext } from "../types";

export class ContextEngine {
  constructor(private context: AgentContext) {}

  get(): AgentContext {
    return { ...this.context, openDocuments: [...this.context.openDocuments], knowledgeCollections: [...this.context.knowledgeCollections] };
  }

  patch(partial: Partial<AgentContext>): AgentContext {
    this.context = { ...this.context, ...partial };
    return this.get();
  }
}
