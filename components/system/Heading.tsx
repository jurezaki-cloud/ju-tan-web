import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const headingClass = {
  1: "text-h1",
  2: "text-h2",
  3: "text-h3",
  4: "text-h3",
  5: "text-body font-heading font-semibold",
  6: "text-small font-heading font-semibold",
} as const;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function Heading({
  level = 2,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  return <Tag className={cn(headingClass[level], className)} {...props} />;
}

export type { HeadingProps };
