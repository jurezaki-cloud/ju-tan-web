"use client";

import { Bot, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "./ChatProvider";

export default function ChatHeader({ titleId }: { titleId: string }) {
  const { setOpen, clear } = useChat();

  return (
    <header className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#16a34a]/12 px-3 py-3 light:border-slate-200 light:bg-green-50">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white">
          <Bot className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2
            id={titleId}
            className="font-heading text-[16px] font-semibold text-white light:text-slate-900"
          >
            🤖 JU-TAN AI
          </h2>
          <p className="text-[12px] text-green-300 light:text-green-700">
            Vaš digitalni pomočnik.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          aria-label="Počisti pogovor"
          onClick={clear}
          className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600 light:hover:bg-slate-100"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label="Zapri JU-TAN AI"
          onClick={() => setOpen(false)}
          className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600 light:hover:bg-slate-100"
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </header>
  );
}
