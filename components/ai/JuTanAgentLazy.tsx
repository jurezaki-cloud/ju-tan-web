"use client";

import dynamic from "next/dynamic";

const JuTanAgent = dynamic(() => import("./JuTanAgent"), {
  ssr: false,
});

export default function JuTanAgentLazy() {
  return <JuTanAgent />;
}
