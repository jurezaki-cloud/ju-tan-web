import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  "AI agenti",
  "CRM / ERP",
  "Avtomatizacija",
  "Integracije",
] as const;

export default function TrustBar() {
  return (
    <section
      aria-label="Področja sodelovanja"
      className="border-y border-white/10 bg-[#0B1220] light:border-slate-200 light:bg-white"
    >
      <ul className="container grid min-h-14 grid-cols-2 md:flex md:min-h-[4.5rem] md:items-center md:justify-center">
        {items.map((item, index) => (
          <li
            key={item}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 text-[13px] font-medium text-slate-300 light:text-slate-600",
              index < items.length - 1 &&
                "md:border-r md:border-white/10 md:px-8 light:md:border-slate-200",
            )}
          >
            <Check
              className="h-3.5 w-3.5 shrink-0 text-[#16a34a]"
              strokeWidth={2.4}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
