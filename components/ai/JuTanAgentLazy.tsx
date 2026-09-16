"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const JuTanAgent = dynamic(() => import("./JuTanAgent"), {
  ssr: false,
  loading: () => (
    <div
      data-nosnippet="true"
      className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-overlay h-12 w-12 md:right-6 md:bottom-6"
      aria-hidden
    />
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
  if (isPlatformPath(pathname)) return null;
  return <JuTanAgent />;
}
