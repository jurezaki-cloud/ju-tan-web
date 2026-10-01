"use client";

import { useState } from "react";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";
import OfficeDownloadDialog from "./OfficeDownloadDialog";

type OfficeDownloadCtaProps = {
  className?: string;
  "aria-label"?: string;
};

export default function OfficeDownloadCta({
  className,
  "aria-label": ariaLabel = "Prenesi JU-TAN Office 1.0.5 za Windows",
}: OfficeDownloadCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(ctaBase, ctaSizes.default, ctaVariants.primary, className)}
        onClick={() => setOpen(true)}
      >
        Prenesi JU-TAN Office 1.0.5
      </button>
      <OfficeDownloadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

