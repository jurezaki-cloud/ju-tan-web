"use client";

import type { ReactNode } from "react";
import Link from "next/link";

const defaultClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50 active:scale-[0.97]";

type CTAButtonProps = {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export default function CTAButton({
  className = defaultClassName,
  onClick,
  children = "Brezplačen posvet",
}: CTAButtonProps) {
  return (
    <Link
      href="/#contact"
      onClick={onClick}
      className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500`}
    >
      {children}
    </Link>
  );
}
