"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AgentButton from "./AgentButton";
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

const AgentWindow = dynamic(() => import("./AgentWindow"), {
  loading: () => (
    <div
      className="pointer-events-auto h-dvh w-full bg-[#050816]/88 md:h-[min(40rem,calc(100dvh-2rem))] md:w-[420px] md:rounded-2xl"
      aria-hidden
    />
  ),
});

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const raw = useSyncExternalStore(
    subscribeAgentHistory,
    getAgentSnapshot,
    getAgentServerSnapshot,
  );
  const state = readState(raw);
  const [open, setOpen] = useState(false);
  const [windowReady, setWindowReady] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const updateHeight = () => {
      const viewport = window.visualViewport;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        setPanelHeight(null);
        return;
      }
      setPanelHeight(Math.round(viewport?.height ?? window.innerHeight));
    };

    updateHeight();
    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    const node = listRef.current;
    if (!node || !open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
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

  if (!mounted) {
    return (
      <div
        data-nosnippet="true"
        className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] h-14 w-14 md:right-6 md:bottom-6"
        aria-hidden
      />
    );
  }

  return (
    <div
      data-nosnippet="true"
      className={`pointer-events-none fixed z-[60] ${
        open
          ? "inset-0 md:inset-auto md:right-6 md:bottom-6"
          : "right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:right-6 md:bottom-6"
      }`}
    >
      <div className="flex h-full min-h-0 flex-col items-end justify-end gap-3">
        {windowReady ? (
        <AgentWindow
          open={open}
          panelHeight={open ? panelHeight : null}
          onClose={() => setOpen(false)}
          onClear={() => {
            setTyping(false);
            clearAgentHistory();
          }}
        >
          <QuickActions disabled={typing} onSelect={send} />
          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3"
            aria-live="polite"
          >
            {state.messages.length === 0 ? (
              <p role="status" className="text-[14px] text-slate-400">
                Začnite pogovor — napišite vprašanje ali izberite hitri gumb.
              </p>
            ) : (
              state.messages.map((message) => (
                <ChatMessage key={message.id} role={message.role} text={message.text} />
              ))
            )}
            {typing ? <TypingIndicator /> : null}
            {state.showForm && !typing ? <LeadForm onSubmit={submitLead} /> : null}
          </div>
          <form
            className="shrink-0 border-t border-white/10 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] light:border-slate-200"
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
                ref={inputRef}
                id={inputId}
                rows={2}
                value={input}
                inputMode="text"
                enterKeyHint="send"
                autoComplete="off"
                autoCorrect="on"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Napišite sporočilo ..."
                className="min-h-11 resize-none rounded-xl border-white/10 bg-black/30 text-[16px] text-white md:text-[16px] light:border-slate-200 light:bg-white light:text-slate-900"
              />
              <Button
                type="submit"
                aria-label="Pošlji sporočilo"
                disabled={typing || !input.trim()}
                className="h-11 w-11 shrink-0 rounded-xl border-0 bg-[#16a34a] text-white hover:bg-[#15803d]"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </AgentWindow>
        ) : null}
        <div className={`pointer-events-auto ${open ? "hidden md:block" : ""}`}>
          <AgentButton
            open={open}
            onToggle={() => {
              setWindowReady(true);
              setOpen((value) => !value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
