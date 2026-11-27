"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useObserverFallback } from "@/hooks/use-browser-capabilities";

// The Office product showcase is well below the first screen. Leave its
// editorial markup/animation untouched but defer its heavyweight Motion
// bundle until the user approaches this section.
const OfficeProductStage = dynamic(() => import("./OfficeProductStage"), {
  ssr: false,
});

export default function OfficeProductStageDeferred() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const observerFallback = useObserverFallback();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "750px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-[830px] sm:min-h-[650px] xl:min-h-[544px]"
    >
      {load || observerFallback ? <OfficeProductStage /> : null}
    </div>
  );
}
