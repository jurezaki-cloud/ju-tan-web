"use client";

import { cn } from "@/lib/utils";
import CTAButton from "@/components/navbar/CTAButton";

type HeaderCTAProps = {
  className?: string;
  onClick?: () => void;
};

export default function HeaderCTA({ className, onClick }: HeaderCTAProps) {
  return (
    <CTAButton className={cn("w-full sm:w-auto", className)} onClick={onClick} />
  );
}
