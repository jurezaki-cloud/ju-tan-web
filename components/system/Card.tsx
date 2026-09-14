import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl text-foreground transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
  {
    variants: {
      variant: {
        default: "bg-surface shadow-sm",
        glass:
          "border border-border bg-glass shadow-glass backdrop-blur-xl",
        elevated: "bg-surface shadow-lg",
        bordered: "border border-border bg-surface",
        interactive:
          "border border-border bg-surface shadow-sm hover:-translate-y-2 hover:scale-[1.02] hover:shadow-glow",
      },
      padding: {
        none: "p-0",
        sm: "p-sm",
        md: "p-lg",
        lg: "p-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export default function Card({
  className,
  variant,
  padding,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

export { cardVariants };
export type { CardProps };
