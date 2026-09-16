"use client";

import { metaClass } from "@/design";
import type { AiActivityItem } from "@/src/ai/types";

export default function ActivityFeed({ items }: { items: AiActivityItem[] }) {
  return (
    <ol className="space-y-3">
      {items.slice(0, 10).map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className={`${metaClass} w-12 shrink-0 tabular-nums`}>{item.time}</span>
          <span className="text-[13px] leading-[1.5] text-slate-300 light:text-slate-700">
            {item.text}
          </span>
        </li>
      ))}
    </ol>
  );
}
