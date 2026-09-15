"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";

export const ctaClassName =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500";

type CTAButtonProps = {
  href?: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  "aria-label"?: string;
};

export default function CTAButton({
  href = "/#contact",
  className,
  onClick,
  children,
  "aria-label": ariaLabel,
}: CTAButtonProps) {
  const copy = getMessages().header;
  const label = children ?? copy.cta;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel ?? copy.ctaAria}
      className={cn(ctaClassName, className)}
    >
      {label}
    </Link>
  );
}
