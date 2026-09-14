"use client";

import { motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AgentButtonProps = {
  open: boolean;
  onToggle: () => void;
};

export default function AgentButton({ open, onToggle }: AgentButtonProps) {
  return (
    <motion.div
      animate={open ? { scale: 1 } : { scale: [1, 1.06, 1] }}
      transition={
        open
          ? { duration: 0.2 }
          : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Button
        type="button"
        aria-expanded={open}
        aria-controls="jutan-agent-window"
        aria-label={open ? "Zapri JU-TAN AI" : "Odpri JU-TAN AI"}
        onClick={onToggle}
        className="h-14 w-14 rounded-full border-0 bg-[#16a34a] text-white shadow-xl shadow-[#16a34a]/40 hover:bg-[#15803d] focus-visible:ring-[#22c55e]"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Bot className="h-6 w-6" aria-hidden />}
      </Button>
    </motion.div>
  );
}
