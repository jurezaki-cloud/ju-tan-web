import { Permission } from "@/src/config/permissions";
import { isGatedTool } from "@/src/ai/approval/policy";

export type AgentPolicyId = "finance" | "delete" | "email" | "invoice" | "payment" | "deployment";

export class AgentPolicy {
  requiresApproval(toolId: string | undefined, policy?: AgentPolicyId): boolean {
    if (policy === "deployment") return true;
    if (policy === "finance") return isGatedTool(toolId) || toolId === "invoice.generate";
    if (policy === "delete") return Boolean(toolId?.toLowerCase().includes("delete"));
    if (policy === "email") return Boolean(toolId?.startsWith("email."));
    if (policy === "invoice") return Boolean(toolId?.includes("invoice"));
    if (policy === "payment") return Boolean(toolId?.startsWith("payment."));
    return isGatedTool(toolId);
  }

  alwaysApproval(toolId: string | undefined): boolean {
    return this.requiresApproval(toolId) || toolId === "invoice.generate";
  }

  aiPermission(): Permission {
    return Permission.AI;
  }
}
