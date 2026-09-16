import { aiService } from "@/src/services/AIService";
import type { Automation } from "@/src/domain/automation";
import type { Conversation } from "@/src/domain/conversation";
import type { AiOverview, Result } from "@/src/types/platform";
import { ok } from "@/src/types/platform";
import {
  artifacts,
  getConversation,
  knowledgeItems,
  offerWorkflow,
  quickActions,
  suggestions,
  workspaceActivity,
  workspaceContext,
} from "@/src/ai/mock";
import { agentForWorkspace, isWorkspaceId } from "@/src/ai/config";
import type { AiWorkspaceId } from "@/src/ai/types";

export async function getAiOverview(): Promise<Result<AiOverview>> {
  return aiService.getOverview();
}

export async function getConversations(): Promise<Result<Conversation[]>> {
  return aiService.listConversations();
}

export async function getAutomations(): Promise<Result<Automation[]>> {
  return aiService.listAutomations();
}

export async function getAiWorkspace(input: {
  workspace?: string;
  conversationId?: string;
}) {
  const workspace: AiWorkspaceId = isWorkspaceId(input.workspace)
    ? input.workspace
    : "chat";
  const messages = getConversation(input.conversationId);

  return ok({
    workspace,
    agent: agentForWorkspace(workspace),
    messages,
    conversationId: input.conversationId ?? null,
    quickActions,
    suggestions,
    knowledgeItems,
    workflow: offerWorkflow,
    artifacts,
    activity: workspaceActivity,
    context: workspaceContext,
  });
}
