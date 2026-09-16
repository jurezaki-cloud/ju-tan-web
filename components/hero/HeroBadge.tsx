import CoreMark from "@/components/common/CoreMark";
import { heroCopy } from "./copy";
import { kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export default function HeroBadge() {
  return (
    <div className={cn(kickerClass, "mb-5 max-w-full")}>
      <CoreMark className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      {heroCopy.badge}
    </div>
  );
}
