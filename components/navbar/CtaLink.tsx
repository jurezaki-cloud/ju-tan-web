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

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default function CtaLink({
  href,
  children,
  className,
  variant = "primary",
  size = "default",
  "aria-label": ariaLabel,
}: CtaLinkProps) {
  const classNames = cn(ctaBase, ctaSizes[size], ctaVariants[variant], className);
  const external = isExternalHref(href);

  if (external) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={classNames}
    >
      {children}
    </Link>
  );
}
