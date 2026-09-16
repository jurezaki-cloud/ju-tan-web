import { ToolError, ValidationError } from "@/src/ai/types/errors";
import type { Tool, ToolContext, ToolExecutor, ToolRegistry, ToolResult } from "@/src/ai/types/tool";

export class InMemoryToolRegistry implements ToolRegistry {
  constructor(private readonly tools = new Map<string, Tool>()) {}

  register(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  get(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  list(): Tool[] {
    return [...this.tools.values()];
  }
}

export class DefaultToolExecutor implements ToolExecutor {
  constructor(private readonly registry: ToolRegistry) {}

  async run(
    id: string,
    input: Record<string, unknown>,
    context: ToolContext,
  ): Promise<ToolResult> {
    const tool = this.registry.get(id);
    if (!tool) throw new ToolError(id, "Orodje ni registrirano.");
    const missing = (tool.schema.required ?? []).filter((key) => input[key] === undefined);
    if (missing.length > 0) {
      throw new ValidationError(`Manjka polje: ${missing.join(", ")}`, missing[0]);
    }
    return tool.execute(input, context);
  }
}
