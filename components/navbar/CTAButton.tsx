"use client";

import type { ReactNode } from "react";

type CTAButtonProps = {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export default function CTAButton({
  className = `
        rounded-full
        bg-emerald-500
        px-6
        py-3
        font-semibold
        text-white
        transition-all
        duration-[250ms]
        hover:bg-emerald-400
        hover:shadow-lg
        hover:shadow-emerald-500/30
      `,
  onClick,
  children = "Brezplačen posvet",
}: CTAButtonProps) {
  return (
    <a
      href="#contact"
      onClick={onClick}
      className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500`}
    >
      {children}
    </a>
  );
}
