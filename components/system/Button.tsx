"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";
import { focusRing } from "./styles";
import Spinner from "./Spinner";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-sm rounded-lg font-medium transition-[transform,box-shadow,background-color,border-color,opacity] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
    "disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]",
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-brand to-success text-primary-foreground shadow-sm hover:shadow-glow",
        secondary:
          "border border-border bg-surface text-foreground hover:border-brand/40 hover:bg-surface-2",
        outline:
          "border border-border bg-transparent text-foreground hover:border-brand/50 hover:bg-brand/10",
        ghost: "bg-transparent text-foreground hover:bg-surface-2",
        danger: "bg-danger text-foreground hover:bg-danger/90",
      },
      size: {
        sm: "min-h-9 px-sm text-small",
        md: "min-h-11 px-lg text-body",
        lg: "min-h-12 px-xl text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    children: ReactNode;
  };

export default function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const messages = getMessages();

  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" label={messages.a11y.loading} />
      ) : null}
      <span className={loading ? "opacity-[var(--opacity-muted)]" : undefined}>
        {children}
      </span>
    </button>
  );
}

export { buttonVariants };
export type { ButtonProps };
