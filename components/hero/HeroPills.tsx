import { cn } from "@/lib/utils";
import { heroCopy } from "./copy";

export default function HeroPills({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[11.5px] font-medium uppercase tracking-[0.16em] text-slate-500 light:text-slate-600 sm:text-[12px]",
        className,
      )}
    >
      <span className="sr-only">Ključna področja: </span>
      {heroCopy.pills.join("  ·  ")}
    </p>
  );
}
