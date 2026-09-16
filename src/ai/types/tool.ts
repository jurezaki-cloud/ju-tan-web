export type ToolSchemaProperty = {
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
};

export type ToolSchema = {
  type: "object";
  properties: Record<string, ToolSchemaProperty>;
  required?: string[];
};

export type ToolResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

export type ToolContext = {
  conversationId?: string;
  projectId?: string;
  clientId?: string;
  now: () => Date;
};

export interface Tool {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly schema: ToolSchema;
  execute(input: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

export interface ToolRegistry {
  register(tool: Tool): void;
  get(id: string): Tool | undefined;
  list(): Tool[];
}

export interface ToolExecutor {
  run(id: string, input: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}
