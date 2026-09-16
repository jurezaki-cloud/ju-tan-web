"use client";

import { useState } from "react";
import FormField from "@/components/platform/FormField";
import FormSection from "@/components/platform/FormSection";
import FormActions from "@/components/platform/FormActions";
import CRMFormDrawer from "./CRMFormDrawer";
import { ctaBase, ctaSizes, ctaVariants, fieldClass } from "@/design";
import { cn } from "@/lib/utils";

export default function CRMEntityForm({
  title,
  action,
  fields,
  hidden,
  triggerLabel,
}: {
  title: string;
  action: (formData: FormData) => Promise<unknown> | Promise<void>;
  fields: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string }[];
  hidden?: Record<string, string>;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      <CRMFormDrawer open={open} title={title} onClose={() => setOpen(false)}>
        <form
          action={async (formData) => {
            await action(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          {Object.entries(hidden ?? {}).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <FormSection title="Podatki">
            {fields.map((field) => (
              <FormField key={field.name} id={field.name} label={field.label}>
                {field.type === "textarea" ? (
                  <textarea id={field.name} name={field.name} className={fieldClass} required={field.required} defaultValue={field.defaultValue} rows={4} />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type ?? "text"}
                    className={fieldClass}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
              </FormField>
            ))}
          </FormSection>
          <FormActions>
            <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
              Shrani
            </button>
          </FormActions>
        </form>
      </CRMFormDrawer>
    </>
  );
}
