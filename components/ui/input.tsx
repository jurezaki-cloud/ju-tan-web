import type { ComponentProps } from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"
import { fieldClass } from "@/design"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(fieldClass, className)}
      {...props}
    />
  )
}

export { Input }
