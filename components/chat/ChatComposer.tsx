"use client";

import { useId } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "./ChatProvider";

export default function ChatComposer() {
  const inputId = useId();
  const { input, setInput, send, typing } = useChat();

  return (
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
          className="min-h-11 resize-none rounded-xl border-white/10 bg-black/30 text-white placeholder:text-slate-500 light:border-slate-200 light:bg-white light:text-slate-900"
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
  );
}
