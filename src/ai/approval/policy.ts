export type ApprovalPolicyId = "default" | "finance" | "strict";

export type Approval = {
  id: string;
  actionId: string;
  title: string;
  description: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  policyId: ApprovalPolicyId;
  createdAt: string;
};

export interface ApprovalPolicy {
  readonly id: ApprovalPolicyId;
  requiresApproval(toolId: string | undefined, actionType: string): boolean;
}

export const GATED_FAMILIES = ["delete", "email", "invoice", "payment"] as const;

export function isGatedTool(toolId: string | undefined): boolean {
  if (!toolId) return false;
  const id = toolId.toLowerCase();
  return (
    id.includes("delete") ||
    id.startsWith("email.") ||
    id.includes("invoice") ||
    id.startsWith("payment.")
  );
}

export class DefaultApprovalPolicy implements ApprovalPolicy {
  readonly id = "default" as const;

  requiresApproval(toolId: string | undefined, _actionType: string): boolean {
    void _actionType;
    return isGatedTool(toolId);
  }
}

export class FinanceApprovalPolicy implements ApprovalPolicy {
  readonly id = "finance" as const;

  requiresApproval(toolId: string | undefined, actionType: string): boolean {
    if (actionType === "create-invoice" || actionType === "create-offer") {
      return isGatedTool(toolId) || toolId === "offer.generate" || toolId === "invoice.generate";
    }
    return isGatedTool(toolId);
  }
}

export class StrictApprovalPolicy implements ApprovalPolicy {
  readonly id = "strict" as const;

  requiresApproval(): boolean {
    return true;
  }
}
