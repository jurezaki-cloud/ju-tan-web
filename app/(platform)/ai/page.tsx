import AIWorkspace from "@/components/platform/ai/AIWorkspace";
import AgentConsole from "@/components/platform/ai/AgentConsole";
import PageState from "@/components/platform/PageState";
import { getAiOverview, getAiWorkspace } from "@/src/api/ai";

type AiPageProps = {
  searchParams: Promise<{ ws?: string; c?: string }>;
};

export default async function AiPage({ searchParams }: AiPageProps) {
  const params = await searchParams;
  const [workspace, overview] = await Promise.all([
    getAiWorkspace({
      workspace: params.ws,
      conversationId: params.c,
    }),
    getAiOverview(),
  ]);

  const status = !workspace.ok ? "error" : "ready";

  return (
    <PageState
      status={status}
      errorDescription={workspace.ok ? undefined : workspace.error}
    >
      {workspace.ok ? (
        <>
          <AIWorkspace
            workspace={workspace.data.workspace}
            agent={workspace.data.agent}
            messages={workspace.data.messages}
            quickActions={workspace.data.quickActions}
            suggestions={workspace.data.suggestions}
            knowledgeItems={workspace.data.knowledgeItems}
            workflow={workspace.data.workflow}
            artifacts={workspace.data.artifacts}
            activity={workspace.data.activity}
            context={workspace.data.context}
            overview={overview.ok ? overview.data : null}
          />
          <AgentConsole />
        </>
      ) : null}
    </PageState>
  );
}
