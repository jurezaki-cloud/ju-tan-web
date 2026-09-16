import type { Tool } from "./tool";

export type McpToolDescriptor = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export interface MCPClientAdapter {
  listTools(): Promise<McpToolDescriptor[]>;
  callTool(name: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface MCPToolAdapter {
  toTool(descriptor: McpToolDescriptor): Tool;
}
