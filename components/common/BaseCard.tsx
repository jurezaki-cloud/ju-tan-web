import type { ReactNode } from "react";
import Link from "next/link";
import { cardBase, focusRing } from "@/design";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  "aria-label"?: string;
};

export default function BaseCard({
  children,
  className,
  href,
  "aria-label": ariaLabel,
}: BaseCardProps) {
  const classes = cn(cardBase, href && focusRing, className);

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  return <article className={classes}>{children}</article>;
}
