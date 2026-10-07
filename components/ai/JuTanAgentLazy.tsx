"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import AgentButton from "./AgentButton";

const JuTanAgent = dynamic(() => import("./JuTanAgent"), {
  ssr: false,
  loading: () => (
    <div
      data-nosnippet="true"
      role="status"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-overlay flex h-12 w-12 items-center justify-center rounded-lg border border-white/12 bg-[#0b1220] text-slate-100 md:right-6 md:bottom-6 light:border-slate-200 light:bg-white light:text-slate-800"
    >
      <span className="sr-only">Nalaganje vodiča storitev …</span>
      <span aria-hidden="true">…</span>
    </div>
  ),
});

function isPlatformPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/logout") ||
    pathname.startsWith("/access-denied") ||
    pathname.startsWith("/session-expired")
  );
}

export default function JuTanAgentLazy() {
  const pathname = usePathname();
  const [activated, setActivated] = useState(false);
  if (isPlatformPath(pathname)) return null;
  if (activated) return <JuTanAgent initialOpen />;
  return (
    <div
      data-nosnippet="true"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-overlay md:right-6 md:bottom-6"
    >
      <AgentButton open={false} onToggle={() => setActivated(true)} />
    </div>
  );
}
