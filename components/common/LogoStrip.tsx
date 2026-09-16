import { cn } from "@/lib/utils";
import { hoverTransition } from "@/design";

const defaultMarks = [
  "Vaše podjetje",
  "Vaš ERP",
  "Vaš CRM",
  "Partner",
] as const;

type LogoStripProps = {
  marks?: readonly string[];
  label?: string;
};

export default function LogoStrip({
  marks = defaultMarks,
  label = "Primeri sodelovanj",
}: LogoStripProps) {
  return (
    <section
      aria-label={label}
      className="bg-[#0B1220] py-6 light:bg-slate-50"
    >
      <ul className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {marks.map((mark) => (
          <li
            key={mark}
            className={cn(
              "font-heading text-[12px] font-semibold uppercase tracking-[0.2em] text-white opacity-55 light:text-slate-900",
              hoverTransition,
              "hover:opacity-80",
            )}
          >
            {mark}
          </li>
        ))}
      </ul>
    </section>
  );
}
