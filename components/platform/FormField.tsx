import type { ReactNode } from "react";
import { fieldClass, labelClass, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import ErrorMessage from "./ErrorMessage";

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children?: ReactNode;
  defaultValue?: string;
  readOnly?: boolean;
};

export default function FormField({
  id,
  label,
  hint,
  error,
  children,
  defaultValue,
  readOnly,
}: FormFieldProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          className={cn(fieldClass)}
          defaultValue={defaultValue}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      )}
      {hint && !error ? (
        <p id={`${id}-hint`} className={`mt-1.5 ${metaClass}`}>
          {hint}
        </p>
      ) : null}
      {error ? <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage> : null}
    </div>
  );
}
