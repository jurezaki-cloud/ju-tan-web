import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export default function StaggerItem({ children, className }: StaggerItemProps) {
  return <div className={cn("content-reveal", className)}>{children}</div>;
}
