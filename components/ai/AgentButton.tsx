"use client";

import { X } from "lucide-react";
import CoreMark from "@/components/common/CoreMark";
import { focusRing } from "@/design";
import { cn } from "@/lib/utils";

type AgentButtonProps = {
  open: boolean;
  onToggle: () => void;
};

export default function AgentButton({ open, onToggle }: AgentButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="jutan-agent-window"
      aria-label={open ? "Zapri vodič storitev" : "Odpri vodič storitev"}
      onClick={onToggle}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/12",
        "bg-[#0b1220] text-slate-100 shadow-[0_12px_28px_rgba(0,0,0,0.45)]",
        "transition-[background-color,border-color,color,box-shadow] duration-hover ease-out",
        "hover:bg-[#111827] hover:text-white",
        focusRing,
        "focus-visible:ring-green-700",
        "light:border-slate-200 light:bg-white light:text-slate-800",
        "light:shadow-[0_10px_24px_rgba(15,23,42,0.1)]",
        "light:hover:border-[#16a34a]/30 light:hover:bg-slate-50 light:hover:text-slate-950",
        "light:focus-visible:ring-[#16a34a]",
      )}
    >
      {open ? (
        <X className="h-5 w-5" aria-hidden />
      ) : (
        <CoreMark className="h-5 w-5 text-slate-200 light:text-slate-700" />
      )}
    </button>
  );
}
