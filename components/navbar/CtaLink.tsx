import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof ctaVariants;
  size?: keyof typeof ctaSizes;
  "aria-label"?: string;
};

export default function CtaLink({
  href,
  children,
  className,
  variant = "primary",
  size = "default",
  "aria-label": ariaLabel,
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(ctaBase, ctaSizes[size], ctaVariants[variant], className)}
    >
      {children}
    </Link>
  );
}
