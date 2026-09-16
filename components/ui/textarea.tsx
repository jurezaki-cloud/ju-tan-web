import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { fieldClass } from "@/design"

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClass, "min-h-[132px] py-3", className)}
      {...props}
    />
  )
}

export { Textarea }
