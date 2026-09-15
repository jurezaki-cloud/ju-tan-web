import CoreMark from "@/components/common/CoreMark";
import { heroCopy } from "./copy";

export default function HeroBadge() {
  return (
    <div className="mb-5 flex max-w-full items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
      <CoreMark className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      {heroCopy.badge}
    </div>
  );
}
