import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dividerVariants = cva("border-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full border-t",
      vertical: "h-full w-px border-l",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type DividerProps = VariantProps<typeof dividerVariants> & {
  className?: string;
};

export default function Divider({ orientation, className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={cn(dividerVariants({ orientation }), className)}
    />
  );
}
