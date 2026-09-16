import type { ReactNode } from "react";

export default function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-heading text-[18px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        {title}
      </legend>
      {description ? (
        <p className="text-[14px] leading-[1.55] text-slate-400">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
