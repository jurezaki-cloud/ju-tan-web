import { ActionError } from "@/src/ai/actions/errors";
import type { EventBus } from "@/src/ai/events/types";
import type { Approval, ApprovalPolicy } from "./policy";
import { DefaultApprovalPolicy } from "./policy";
import type { ApprovalStore } from "./store";
import { InMemoryApprovalStore } from "./store";

export class ApprovalEngine {
  constructor(
    private readonly store: ApprovalStore = new InMemoryApprovalStore(),
    private readonly policy: ApprovalPolicy = new DefaultApprovalPolicy(),
    private readonly bus?: EventBus,
    private readonly now: () => Date = () => new Date(),
    private readonly nextId: () => string = () => `apr-${this.now().getTime()}`,
  ) {}

  getPolicy(): ApprovalPolicy {
    return this.policy;
  }

  async get(id: string): Promise<Approval | undefined> {
    return this.store.get(id);
  }

  async forAction(actionId: string): Promise<Approval | undefined> {
    return this.store.byAction(actionId);
  }

  isGranted(approval: Approval | undefined): boolean {
    return Boolean(approval?.approved);
  }

  async request(input: {
    actionId: string;
    title: string;
    description: string;
  }): Promise<Approval> {
    const existing = await this.store.byAction(input.actionId);
    if (existing) return existing;
    const approval: Approval = {
      id: this.nextId(),
      actionId: input.actionId,
      title: input.title,
      description: input.description,
      approved: false,
      policyId: this.policy.id,
      createdAt: this.now().toISOString(),
    };
    await this.store.save(approval);
    this.bus?.emit({
      type: "ApprovalRequested",
      at: approval.createdAt,
      actionId: input.actionId,
      payload: { approvalId: approval.id },
    });
    return approval;
  }

  async grant(approvalId: string, approvedBy: string): Promise<Approval> {
    const approval = await this.store.get(approvalId);
    if (!approval) throw new ActionError("Odobritev ni najdena.");
    const next: Approval = {
      ...approval,
      approved: true,
      approvedBy,
      approvedAt: this.now().toISOString(),
    };
    await this.store.save(next);
    this.bus?.emit({
      type: "ApprovalGranted",
      at: next.approvedAt ?? next.createdAt,
      actionId: next.actionId,
      payload: { approvalId: next.id, approvedBy },
    });
    return next;
  }
}
