"use client";

import { useChat, useChatMounted } from "./ChatProvider";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";

/** Odjemalski vtičnik JU-TAN AI; vsebina se ne izriše na strežniku (SEO). */
export default function AIChat() {
  const mounted = useChatMounted();
  const { open } = useChat();

  if (!mounted) return null;

  return (
    <div
      data-nosnippet="true"
      className={`pointer-events-none fixed z-[60] ${
        open
          ? "inset-0 md:inset-auto md:right-6 md:bottom-6"
          : "right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:right-6 md:bottom-6"
      }`}
    >
      <div className="flex h-full flex-col items-end justify-end gap-3">
        <ChatWindow />
        <div className={`pointer-events-none ${open ? "hidden md:block" : ""}`}>
          <ChatLauncher />
        </div>
      </div>
    </div>
  );
}
