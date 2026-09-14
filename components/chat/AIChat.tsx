"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Trash2, X } from "lucide-react";
import {
  clearChatHistory,
  getChatHistoryServerSnapshot,
  getChatHistorySnapshot,
  publishChatHistory,
  quickActions,
  replyToMessage,
  subscribeChatHistory,
  type ChatMessage,
} from "@/lib/chat";

export default function AIChat() {
  const titleId = useId();
  const inputId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const historyRaw = useSyncExternalStore(
    subscribeChatHistory,
    getChatHistorySnapshot,
    getChatHistoryServerSnapshot,
  );
  const messages = JSON.parse(historyRaw) as ChatMessage[];

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const sendText = (text: string) => {
    const value = text.trim();
    if (!value || typing) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: value },
    ];
    setInput("");
    publishChatHistory(nextMessages);
    setTyping(true);

    window.setTimeout(() => {
      publishChatHistory([
        ...nextMessages,
        { role: "assistant", text: replyToMessage(value) },
      ]);
      setTyping(false);
    }, 780);
  };

  const clearHistory = () => {
    setTyping(false);
    clearChatHistory();
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="pointer-events-auto flex h-[min(36rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#050816]/88 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            id="jutan-ai-dialog"
          >
            <header className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#16a34a]/12 px-3 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-lg shadow-green-600/30">
                  <Bot className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="font-heading text-[16px] font-semibold text-white"
                  >
                    🤖 JU-TAN AI
                  </h2>
                  <p className="text-[12px] text-green-300">Digitalni pomočnik</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Izbriši zgodovino pogovora"
                  onClick={clearHistory}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Zapri JU-TAN AI"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </header>

            <div
              className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2"
              aria-label="Hitra vprašanja"
            >
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendText(action.prompt)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-200 transition hover:border-green-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
              aria-live="polite"
            >
              {messages.map((message, index) => (
                <p
                  key={`${message.role}-${index}-${message.text.slice(0, 12)}`}
                  className={`max-w-[92%] whitespace-pre-line rounded-2xl px-3 py-2 text-[14px] leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-[#16a34a] text-white"
                      : "border border-white/10 bg-white/5 text-slate-100"
                  }`}
                >
                  {message.text}
                </p>
              ))}
              {typing ? (
                <p
                  role="status"
                  className="max-w-[92%] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-green-300"
                >
                  JU-TAN AI piše...
                </p>
              ) : null}
            </div>

            <form
              className="border-t border-white/10 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                sendText(input);
              }}
            >
              <label className="sr-only" htmlFor={inputId}>
                Vprašanje za JU-TAN AI
              </label>
              <div className="flex items-end gap-2">
                <textarea
                  id={inputId}
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendText(input);
                    }
                  }}
                  placeholder="Napišite vprašanje ..."
                  className="min-h-11 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[16px] text-white outline-none placeholder:text-slate-500 focus-visible:border-green-500 sm:text-[14px]"
                />
                <button
                  type="submit"
                  aria-label="Pošlji sporočilo"
                  disabled={typing || !input.trim()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16a34a] text-white shadow-lg shadow-green-600/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls="jutan-ai-dialog"
        aria-label={open ? "Zapri JU-TAN AI" : "Odpri JU-TAN AI"}
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_12px_40px_rgba(22,163,74,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Bot className="h-6 w-6" aria-hidden />}
      </motion.button>
    </div>
  );
}
