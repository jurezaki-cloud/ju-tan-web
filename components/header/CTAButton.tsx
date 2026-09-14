"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";

type HeaderCTAButtonProps = {
  className?: string;
  onClick?: () => void;
};

export default function CTAButton({ className, onClick }: HeaderCTAButtonProps) {
  const copy = getMessages().header;

  return (
    <Link
      href="/#contact"
      onClick={onClick}
      aria-label={copy.ctaAria}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms]",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/50 active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
        className,
      )}
    >
      {copy.cta}
    </Link>
  );
}
