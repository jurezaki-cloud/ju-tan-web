"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";

const baseButtonClass =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] font-semibold tracking-[-0.01em] transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] light:focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";

const buttonSizes = {
  default: "px-6 py-3 text-[14px]",
  compact: "px-4 py-2 text-[13px]",
} as const;

export const buttonVariants = {
  primary:
    "bg-[#16a34a] text-white shadow-[0_8px_24px_rgba(0,0,0,0.32)] hover:-translate-y-[2px] hover:bg-[#15803d] hover:shadow-[0_10px_28px_rgba(22,163,74,0.22)] active:translate-y-0",
  secondary:
    "border border-white/12 bg-transparent text-slate-100 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.04] active:translate-y-0",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/[0.04] hover:text-white",
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
      aria-label={ariaLabel}
      className={classes}
    >
      {label}
    </Link>
  );
}
