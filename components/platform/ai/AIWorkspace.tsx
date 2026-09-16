import Link from "next/link";
import { Bot, Clock3, MessageSquare, Percent } from "lucide-react";
import {
  cardSurface,
  colorTransition,
  focusRing,
  headingCard,
  ledeClass,
  metaClass,
} from "@/design";
import { cn } from "@/lib/utils";
import StatsCard from "@/components/platform/StatsCard";
import { workspaceNav } from "@/src/ai/config";
import type { AiAgent, AiWorkspaceId } from "@/src/ai/types";
import type { AiOverview } from "@/src/types/platform";
import type {
  AiActivityItem,
  AiArtifact,
  AiContext,
  AiMessage,
  KnowledgeItem,
  QuickAction,
  Suggestion,
  Workflow,
} from "@/src/ai/types";
import QuickActionCard from "./QuickActionCard";
import KnowledgeCard from "./KnowledgeCard";
import WorkflowTimeline from "./WorkflowTimeline";
import ArtifactCard from "./ArtifactCard";
import ContextPanel from "./ContextPanel";
import AIChat from "./AIChat";

type AIWorkspaceProps = {
  workspace: AiWorkspaceId;
  agent: AiAgent;
  messages: AiMessage[] | null;
  quickActions: QuickAction[];
  suggestions: Suggestion[];
  knowledgeItems: KnowledgeItem[];
  workflow: Workflow;
  artifacts: AiArtifact[];
  activity: AiActivityItem[];
  context: AiContext;
  overview: AiOverview | null;
};

export default function AIWorkspace({
  workspace,
  agent,
  messages,
  quickActions,
  suggestions,
  knowledgeItems,
  workflow,
  artifacts,
  activity,
  context,
  overview,
}: AIWorkspaceProps) {
  const hasConversation = Boolean(messages && messages.length > 0);
  const showDashboard = workspace === "dashboard" && !hasConversation;
  const showKnowledge = workspace === "knowledge" && !hasConversation;
  const showWorkflows = workspace === "automation" && !hasConversation;
  const showChat = hasConversation;
  const showWelcome = !showChat && !showDashboard && !showKnowledge && !showWorkflows;

  return (
    <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 gap-4 xl:grid-cols-[13.5rem_minmax(0,1fr)_17.5rem]">
      <nav className={`${cardSurface} h-fit p-3`} aria-label="AI Workspaces">
        <p className={`${metaClass} px-3 py-2`}>AI Workspaces</p>
        <ul className="space-y-0.5">
          {workspaceNav.map((item) => {
            const active = item.id === workspace;
            return (
              <li key={item.id}>
                <Link
                  href={item.id === "chat" ? "/ai" : `/ai?ws=${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 text-[14px] font-medium",
                    colorTransition,
                    focusRing,
                    active
                      ? "bg-white/[0.04] text-white light:bg-slate-100 light:text-slate-900"
                      : "text-slate-400 hover:text-white light:hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className={`${cardSurface} flex min-h-[32rem] flex-col p-6 sm:p-8`}>
        {showWelcome ? (
          <div>
            <p className={metaClass}>JU-TAN AI</p>
            <h1 className="heading-display mt-2 font-heading font-semibold text-white light:text-slate-900">
              JU-TAN AI Enterprise Workspace
            </h1>
            <p className={cn(ledeClass, "mt-3 max-w-2xl")}>
              AI pomočnik za poslovne sisteme, CRM, ERP, AI agente, avtomatizacijo in
              razvoj.
            </p>
            <p className={`${headingCard} mt-10`}>Dobrodošli v JU-TAN AI</p>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <li key={action.id}>
                  <QuickActionCard action={action} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showDashboard ? (
          <div>
            <h1 className={`${headingCard} text-[1.5rem]`}>Dashboard</h1>
            <p className={`mt-2 ${ledeClass}`}>Pregled pogovorov in avtomatizacij. Podatki so mock.</p>
            {overview ? (
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <li>
                  <StatsCard
                    icon={MessageSquare}
                    label="Število pogovorov"
                    value={String(overview.conversations)}
                  />
                </li>
                <li>
                  <StatsCard icon={Percent} label="Uspešnost" value={overview.successRate} />
                </li>
                <li>
                  <StatsCard icon={Clock3} label="Prihranjen čas" value={overview.timeSaved} />
                </li>
                <li>
                  <StatsCard
                    icon={Bot}
                    label="Avtomatizacije"
                    value={String(overview.automations)}
                  />
                </li>
              </ul>
            ) : (
              <p className={`mt-6 ${ledeClass}`}>Pregled trenutno ni na voljo.</p>
            )}
            <h2 className={`${headingCard} mt-8`}>Artifacts</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {artifacts.map((artifact) => (
                <li key={artifact.id}>
                  <ArtifactCard artifact={artifact} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showKnowledge ? (
          <div>
            <h1 className={`${headingCard} text-[1.5rem]`}>Knowledge Base</h1>
            <p className={`mt-2 ${ledeClass}`}>
              Zbirke za kasnejši RAG. Vsebina ni indeksirana.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {knowledgeItems.map((item) => (
                <li key={item.id}>
                  <KnowledgeCard item={item} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showWorkflows ? (
          <div>
            <h1 className={`${headingCard} text-[1.5rem]`}>AI Workflows</h1>
            <p className={`mt-2 mb-6 ${ledeClass}`}>Tok od analize do e-pošte. Koraki so mock.</p>
            <WorkflowTimeline workflow={workflow} />
          </div>
        ) : null}

        {showChat && messages ? (
          <AIChat
            initialMessages={messages}
            suggestions={suggestions}
            agentName={agent.name}
          />
        ) : null}
      </section>

      <ContextPanel context={context} activity={activity} />
    </div>
  );
}
