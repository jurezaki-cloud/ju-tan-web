import { Sparkles } from "lucide-react";
import { company } from "@/lib/data/company";

export default function HeroBadge() {
  return (
    <div className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1.5 text-left text-sm font-medium leading-snug text-green-400 shadow-[0_0_24px_rgba(34,197,94,0.12)] backdrop-blur-md">
      <span className="hero-sparkle inline-flex">
        <Sparkles className="h-4 w-4" />
      </span>
      {company.badge}
    </div>
  );
}
