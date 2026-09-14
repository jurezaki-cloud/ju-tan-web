"use client";

import Link from "next/link";

type CTAButtonProps = {
  className?: string;
  onClick?: () => void;
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
}: CTAButtonProps) {
  return (
    <Link href="#contact" onClick={onClick} className={className}>
      Brezplačen posvet
    </Link>
  );
}
