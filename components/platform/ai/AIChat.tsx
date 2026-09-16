"use client";

import { useMemo, useState } from "react";
import type { AiMessage, Suggestion } from "@/src/ai/types";
import AIMessage from "./AIMessage";
import AIComposer from "./AIComposer";
import SuggestionBar from "./SuggestionBar";
import AIStatus from "./AIStatus";
import { metaClass } from "@/design";

type AIChatProps = {
  initialMessages: AiMessage[];
  suggestions: Suggestion[];
  agentName: string;
};

export default function AIChat({
  initialMessages,
  suggestions,
  agentName,
}: AIChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [busy, setBusy] = useState(false);

  const status = useMemo(
    () => (busy ? "Working" : "Ready"),
    [busy],
  );

  const send = (text: string) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userMessage: AiMessage = {
      id: `u-${now.getTime()}`,
      role: "user",
      time,
      status: "Completed",
      kind: "text",
      body: text,
    };
    const reply: AiMessage = {
      id: `a-${now.getTime()}`,
      role: "assistant",
      time,
      status: "Completed",
      kind: "text",
      body: "Odgovor je mock. Provider in model se nastavita v konfiguraciji agenta, UI ostane enak.",
    };
    setBusy(true);
    setMessages((current) => [...current, userMessage]);
    window.setTimeout(() => {
      setMessages((current) => [...current, reply]);
      setBusy(false);
    }, 220);
  };

  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className={metaClass}>{agentName}</p>
        <AIStatus status={busy ? "Working" : "Ready"} />
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {messages.map((message) => (
          <AIMessage key={message.id} message={message} />
        ))}
      </div>
      <div className="mt-6 space-y-3 border-t border-white/10 pt-4 light:border-slate-200">
        <SuggestionBar items={suggestions} />
        <AIComposer onSend={send} disabled={busy} />
        <p className={metaClass}>Status: {status}. Streaming ni vklopljen.</p>
      </div>
    </div>
  );
}
