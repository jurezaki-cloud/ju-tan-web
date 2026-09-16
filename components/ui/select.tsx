import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/design";

function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(fieldClass, className)}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
