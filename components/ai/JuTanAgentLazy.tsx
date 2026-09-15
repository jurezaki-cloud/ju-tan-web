"use client";

import dynamic from "next/dynamic";

const JuTanAgent = dynamic(() => import("./JuTanAgent"), {
  ssr: false,
  loading: () => (
    <div
      data-nosnippet="true"
      className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] h-12 w-12 md:right-6 md:bottom-6"
      aria-hidden
    />
  ),
});

export default function JuTanAgentLazy() {
  return <JuTanAgent />;
}
