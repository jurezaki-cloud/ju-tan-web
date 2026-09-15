"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@/components/background/AINetwork"), {
  ssr: false,
  loading: () => null,
});

export default function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas />
    </div>
  );
}
