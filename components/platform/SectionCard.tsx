import type { ReactNode } from "react";
import { cardSurface } from "@/design";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section className={cn(cardSurface, "p-6", className)}>
      {title ? (
        <header className="mb-4">
          <h2 className="font-heading text-[18px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[14px] leading-[1.55] text-slate-400">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
