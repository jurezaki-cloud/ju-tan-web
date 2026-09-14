"use client";

import { motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "./ChatProvider";

export default function ChatLauncher() {
  const { open, setOpen } = useChat();

  return (
    <motion.div
      className="pointer-events-auto"
      animate={open ? { scale: 1 } : { scale: [1, 1.06, 1] }}
      transition={
        open
          ? { duration: 0.2 }
          : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Button
        type="button"
        aria-expanded={open}
        aria-controls="jutan-ai-dialog"
        aria-label={open ? "Zapri JU-TAN AI" : "Odpri JU-TAN AI"}
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full border-0 bg-[#16a34a] text-white shadow-[0_12px_40px_rgba(22,163,74,0.45)] hover:bg-[#15803d] focus-visible:ring-green-300"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Bot className="h-6 w-6" aria-hidden />}
      </Button>
    </motion.div>
  );
}
