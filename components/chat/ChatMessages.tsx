"use client";

import { useEffect, useRef } from "react";
import { useChat } from "./ChatProvider";

export default function ChatMessages() {
  const listRef = useRef<HTMLDivElement>(null);
  const { persisted, typing, options, send } = useChat();

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [persisted.messages, typing]);

  return (
    <div
      ref={listRef}
      className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
      aria-live="polite"
    >
      {persisted.messages.map((message, index) => (
        <p
          key={`${message.role}-${index}-${message.text.slice(0, 16)}`}
          className={`max-w-[92%] whitespace-pre-line rounded-2xl px-3 py-2 text-[14px] leading-6 ${
            message.role === "user"
              ? "ml-auto bg-[#16a34a] text-white"
              : "border border-white/10 bg-white/5 text-slate-100 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
          }`}
        >
          {message.text}
        </p>
      ))}

      {typing ? (
        <p
          role="status"
          className="max-w-[92%] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-green-300 light:border-slate-200 light:bg-green-50 light:text-green-800"
        >
          JU-TAN AI piše ...
        </p>
      ) : null}

      {!typing && options.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Možni odgovori">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => send(option)}
              className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-[13px] text-green-200 transition hover:bg-green-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-green-800"
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
