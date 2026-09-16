"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoreMark from "@/components/common/CoreMark";

type AgentButtonProps = {
  open: boolean;
  onToggle: () => void;
};

export default function AgentButton({ open, onToggle }: AgentButtonProps) {
  return (
    <Button
      type="button"
      aria-expanded={open}
      aria-controls="jutan-agent-window"
      aria-label={open ? "Zapri vodič storitev" : "Odpri vodič storitev"}
      onClick={onToggle}
      className="h-12 w-12 rounded-lg border border-white/12 bg-[#0b1220] text-slate-100 shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:bg-[#111827] hover:text-white focus-visible:ring-green-700"
    >
      {open ? (
        <X className="h-5 w-5" aria-hidden />
      ) : (
        <CoreMark className="h-5 w-5 text-slate-200" />
      )}
    </Button>
  );
}
