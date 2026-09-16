"use client";

import { useState } from "react";
import { ctaBase, ctaSizes, ctaVariants, fieldClass } from "@/design";
import { cn } from "@/lib/utils";

type AIComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function AIComposer({ onSend, disabled }: AIComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="ai-composer" className="sr-only">
        Sporočilo
      </label>
      <textarea
        id="ai-composer"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Opišite nalogo. Odgovor je mock."
        rows={2}
        disabled={disabled}
        className={cn(fieldClass, "h-auto min-h-11 resize-none py-3")}
      />
      <button
        type="submit"
        className={cn(ctaBase, ctaSizes.default, ctaVariants.primary, "shrink-0")}
        disabled={disabled || value.trim().length === 0}
      >
        Pošlji
      </button>
    </form>
  );
}
