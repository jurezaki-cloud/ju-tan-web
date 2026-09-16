import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ledeClass } from "@/design";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="heading-display font-heading font-semibold text-white light:text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className={cn(ledeClass, "mt-2 max-w-2xl")}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}