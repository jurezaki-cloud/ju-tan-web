"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";

const baseButtonClass =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-[250ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] disabled:pointer-events-none disabled:opacity-50";

const buttonSizes = {
  default: "px-7 py-3.5 text-[15px]",
  compact: "px-5 py-2.5 text-[13px]",
} as const;

export const buttonVariants = {
  primary:
    "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_10px_30px_rgba(34,197,94,0.28)] hover:scale-[1.03] hover:shadow-[0_14px_40px_rgba(34,197,94,0.45)] active:scale-[0.97]",
  secondary:
    "border border-white/15 bg-white/5 text-white shadow-md shadow-black/20 backdrop-blur-sm hover:scale-[1.03] hover:border-green-500/50 hover:bg-white/10 hover:shadow-[0_12px_32px_rgba(34,197,94,0.18)] active:scale-[0.97]",
  ghost:
    "bg-transparent text-green-400 hover:bg-white/5 hover:text-green-300 active:scale-[0.98]",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export const ctaClassName = cn(
  baseButtonClass,
  buttonSizes.default,
  buttonVariants.primary,
);

type CTAButtonProps = {
  href?: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function CTAButton({
  href = "/#contact",
  className,
  onClick,
  children,
  variant = "primary",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel,
}: CTAButtonProps) {
  const copy = getMessages().header;
  const label = children ?? copy.cta;
  const classes = cn(
    baseButtonClass,
    buttonSizes[size],
    buttonVariants[variant],
    className,
  );

  if (disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel ?? copy.ctaAria}
      className={classes}
    >
      {label}
    </Link>
  );
}
