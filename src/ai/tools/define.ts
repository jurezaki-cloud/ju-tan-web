import type { Tool, ToolContext, ToolResult, ToolSchema } from "@/src/ai/types/tool";

export function defineTool(
  id: string,
  name: string,
  description: string,
  schema: ToolSchema,
  run: (input: Record<string, unknown>, context: ToolContext) => Promise<unknown> | unknown,
): Tool {
  return {
    id,
    name,
    description,
    schema,
    async execute(input, context): Promise<ToolResult> {
      try {
        const data = await run(input, context);
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : "Izvedba orodja ni uspela.",
        };
      }
    },
  };
}

export const stringProp = (description: string) =>
  ({ type: "string" as const, description });
