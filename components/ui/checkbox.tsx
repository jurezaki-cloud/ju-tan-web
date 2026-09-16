import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "@/design";

function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "mt-1 h-5 w-5 shrink-0 rounded-check border-white/30 accent-[#16a34a]",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
