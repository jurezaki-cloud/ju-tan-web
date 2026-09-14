"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { focusRing } from "./styles";

const iconButtonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg border transition-[background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
    "disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]",
    focusRing,
  ),
  {
    variants: {
      variant: {
        ghost: "border-transparent bg-transparent text-foreground hover:bg-surface-2",
        outline: "border-border bg-surface text-foreground hover:border-brand/40",
        primary: "border-transparent bg-brand text-primary-foreground hover:shadow-glow",
      },
      size: {
        sm: "size-9",
        md: "size-11",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    label: string;
    children: ReactNode;
  };

export default function IconButton({
  className,
  variant,
  size,
  label,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export type { IconButtonProps };
