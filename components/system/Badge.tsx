import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2xs rounded-full px-sm py-2xs text-caption font-medium",
  {
    variants: {
      tone: {
        brand: "border border-brand/30 bg-brand/10 text-brand",
        muted: "border border-border bg-surface-2 text-muted-foreground",
        success: "border border-success/30 bg-success/10 text-success",
        warning: "border border-warning/30 bg-warning/10 text-warning",
        danger: "border border-danger/30 bg-danger/10 text-danger",
      },
    },
    defaultVariants: {
      tone: "brand",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export default function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export type { BadgeProps };
