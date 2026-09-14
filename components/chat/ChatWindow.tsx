"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "./ChatProvider";
import ChatHeader from "./ChatHeader";
import ChatQuickActions from "./ChatQuickActions";
import ChatMessages from "./ChatMessages";
import ChatComposer from "./ChatComposer";

export default function ChatWindow() {
  const titleId = useId();
  const { open, setOpen } = useChat();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          key="panel"
          id="jutan-ai-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-nosnippet="true"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-auto flex h-[100dvh] w-full flex-col overflow-hidden border-white/10 bg-[#050816]/92 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:h-[min(40rem,calc(100dvh-2rem))] md:w-[420px] md:rounded-[20px] md:border light:border-slate-200 light:bg-white/95"
        >
          <ChatHeader titleId={titleId} />
          <ChatQuickActions />
          <ChatMessages />
          <ChatComposer />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
