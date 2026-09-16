"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { getMessages } from "@/lib/i18n/messages";

export type ButtonVariant = keyof typeof ctaVariants;
export type ButtonSize = keyof typeof ctaSizes;

type CTAButtonProps = {
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function CTAButton({
  href,
  type = "button",
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
  const classes = cn(ctaBase, ctaSizes[size], ctaVariants[variant], className);

  if (href) {
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {label}
        </span>
      );
    }

    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {label}
    </button>
  );
}
