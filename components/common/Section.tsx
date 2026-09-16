import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  belowFold?: boolean;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  decorate?: ReactNode;
  children: ReactNode;
};

export default function Section({
  id,
  belowFold = false,
  className,
  innerClassName,
  labelledBy,
  decorate,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative overflow-hidden section-y",
        belowFold && "below-fold",
        className,
      )}
    >
      {decorate}
      <div className={cn("container relative", innerClassName)}>{children}</div>
    </section>
  );
}
