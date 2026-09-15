"use client";

import type { AgentRole } from "./content";

type ChatMessageProps = {
  role: AgentRole;
  text: string;
};

export default function ChatMessage({ role, text }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <p
      className={`max-w-[90%] whitespace-pre-line rounded-[10px] px-3 py-2 text-[14px] leading-6 ${
        isUser
          ? "ml-auto bg-[#16a34a] text-white"
          : "border border-white/10 bg-white/5 text-slate-100 backdrop-blur-md light:border-slate-200 light:bg-white light:text-slate-800"
      }`}
    >
      {text}
    </p>
  );
}
