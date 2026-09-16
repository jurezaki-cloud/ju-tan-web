import { ProviderError } from "@/src/ai/types/errors";
import type { MCPClientAdapter, MCPToolAdapter, McpToolDescriptor } from "@/src/ai/types/mcp";
import type { Tool, ToolResult } from "@/src/ai/types/tool";

export class MockMCPClientAdapter implements MCPClientAdapter {
  async listTools(): Promise<McpToolDescriptor[]> {
    return [];
  }

  async callTool(name: string, _input: Record<string, unknown>): Promise<unknown> {
    void _input;
    throw new ProviderError("mcp", `MCP orodje ${name} ni priklopljeno.`);
  }
}

export class DefaultMCPToolAdapter implements MCPToolAdapter {
  constructor(private readonly client: MCPClientAdapter) {}

  toTool(descriptor: McpToolDescriptor): Tool {
    return {
      id: `mcp.${descriptor.name}`,
      name: descriptor.name,
      description: descriptor.description,
      schema: {
        type: "object",
        properties: {},
      },
      execute: async (input): Promise<ToolResult> => {
        try {
          const data = await this.client.callTool(descriptor.name, input);
          return { ok: true, data };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "MCP klic ni uspel.",
          };
        }
      },
    };
  }
}
