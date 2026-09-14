import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType;
  children: ReactNode;
};

export default function Container({
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn("container", className)} {...props}>
      {children}
    </Tag>
  );
}

export type { ContainerProps };
