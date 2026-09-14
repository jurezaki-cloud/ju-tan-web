"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import {
  replyToMessage,
  welcomeMessage,
  type ChatMessage,
} from "@/lib/chat";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", text: replyToMessage(text) },
    ]);
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            aria-label="AI pomočnik"
            className="pointer-events-auto flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050816]/85 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-green-500/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-white">
                    JU-TAN pomočnik
                  </p>
                  <p className="text-[11px] text-green-300">Na voljo zdaj</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Zapri klepet"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-[14px] leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-green-600 text-white"
                      : "border border-white/10 bg-white/5 text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form
              className="border-t border-white/10 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <label className="sr-only" htmlFor="ai-chat-input">
                Vprašanje za pomočnika
              </label>
              <div className="flex gap-2">
                <input
                  id="ai-chat-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Napišite vprašanje ..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-[14px] text-white outline-none placeholder:text-slate-500 focus-visible:border-green-500"
                />
                <button
                  type="submit"
                  aria-label="Pošlji sporočilo"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/30 transition hover:shadow-green-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Zapri AI pomočnika" : "Odpri AI pomočnika"}
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_12px_40px_rgba(34,197,94,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
