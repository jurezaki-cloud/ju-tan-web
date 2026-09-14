import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  contained?: boolean;
};

export default function Section({
  className,
  children,
  contained = true,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative py-section", className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

export type { SectionProps };
