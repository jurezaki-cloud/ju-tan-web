"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AgentButton from "./AgentButton";
import AgentWindow from "./AgentWindow";
import ChatMessage from "./ChatMessage";
import LeadForm, { formatLeadSummary, type LeadPayload } from "./LeadForm";
import QuickActions from "./QuickActions";
import TypingIndicator from "./TypingIndicator";
import { isOfferIntent, replyToPrompt } from "./content";
import {
  clearAgentHistory,
  emptyAgentState,
  getAgentServerSnapshot,
  getAgentSnapshot,
  publishAgentState,
  subscribeAgentHistory,
  type AgentState,
} from "./storage";

const emptySubscribe = () => () => undefined;

function readState(raw: string): AgentState {
  try {
    const parsed = JSON.parse(raw) as AgentState;
    if (!parsed?.messages?.length) return emptyAgentState;
    return parsed;
  } catch {
    return emptyAgentState;
  }
}

export default function JuTanAgent() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const inputId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const raw = useSyncExternalStore(
    subscribeAgentHistory,
    getAgentSnapshot,
    getAgentServerSnapshot,
  );
  const state = readState(raw);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [state.messages, typing, state.showForm, open]);

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || typing) return;

      const nextMessages = [
        ...state.messages,
        { id: crypto.randomUUID(), role: "user" as const, text: value },
      ];
      const offer = isOfferIntent(value);
      setInput("");
      publishAgentState({ messages: nextMessages, showForm: offer });
      setTyping(true);

      window.setTimeout(() => {
        publishAgentState({
          showForm: offer,
          messages: [
            ...nextMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: offer
                ? "Odlično. Izpolnite obrazec, da pripravimo ponudbo."
                : replyToPrompt(value),
            },
          ],
        });
        setTyping(false);
      }, 700);
    },
    [state.messages, typing],
  );

  const submitLead = (payload: LeadPayload) => {
    publishAgentState({
      showForm: false,
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: formatLeadSummary(payload),
        },
      ],
    });
  };

  if (!mounted) return null;

  return (
    <div
      data-nosnippet="true"
      className={`pointer-events-none fixed z-[60] ${
        open
          ? "inset-0 md:inset-auto md:right-6 md:bottom-6"
          : "right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:right-6 md:bottom-6"
      }`}
    >
      <div className="flex h-full flex-col items-end justify-end gap-3">
        <AgentWindow
          open={open}
          onClose={() => setOpen(false)}
          onClear={() => {
            setTyping(false);
            clearAgentHistory();
          }}
        >
          <QuickActions disabled={typing} onSelect={send} />
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
            aria-live="polite"
          >
            {state.messages.map((message) => (
              <ChatMessage key={message.id} role={message.role} text={message.text} />
            ))}
            {typing ? <TypingIndicator /> : null}
            {state.showForm && !typing ? <LeadForm onSubmit={submitLead} /> : null}
          </div>
          <form
            className="border-t border-white/10 p-3 light:border-slate-200"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor={inputId}>
              Vprašanje za JU-TAN AI
            </label>
            <div className="flex items-end gap-2">
              <Textarea
                id={inputId}
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Napišite sporočilo ..."
                className="min-h-11 resize-none rounded-xl border-white/10 bg-black/30 text-white light:border-slate-200 light:bg-white light:text-slate-900"
              />
              <Button
                type="submit"
                aria-label="Pošlji sporočilo"
                disabled={typing || !input.trim()}
                className="h-11 w-11 rounded-xl border-0 bg-[#16a34a] text-white hover:bg-[#15803d]"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </AgentWindow>
        <div className={`pointer-events-auto ${open ? "hidden md:block" : ""}`}>
          <AgentButton open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
      </div>
    </div>
  );
}
