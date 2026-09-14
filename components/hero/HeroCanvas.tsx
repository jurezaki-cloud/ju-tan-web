"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@/components/background/AINetwork"), {
  ssr: false,
});

export default function HeroCanvas() {
  return <Canvas />;
}
