"use client";

import { quickActions } from "@/lib/chat";
import { useChat } from "./ChatProvider";

export default function ChatQuickActions() {
  const { send, typing } = useChat();

  return (
    <div
      className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 light:border-slate-200"
      aria-label="Hitri gumbi"
    >
      {quickActions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={typing}
          onClick={() => send(action.prompt)}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-200 transition hover:border-green-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
