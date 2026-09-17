import CoreMark from "@/components/common/CoreMark";
import { heroCopy } from "./copy";
import { kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export default function HeroBadge() {
  return (
    <div
      className={cn(
        kickerClass,
        "mb-6 inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-slate-300 light:border-slate-200 light:bg-white/80 light:text-slate-700",
      )}
    >
      <CoreMark className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" />
      {heroCopy.badge}
    </div>
  );
}
