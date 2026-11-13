import Link from "next/link";
import { brandName } from "@/brand/theme";
import BrandLogo from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";
import { focusRing, hoverTransition } from "@/design";

export default function HeaderLogo() {
  return (
    <Link
      href="/#home"
      aria-label={`${brandName} domov`}
      className={cn(
        "flex min-h-11 min-w-11 shrink-0 items-center rounded-lg hover:-translate-y-px",
        hoverTransition,
        focusRing,
      )}
    >
      <span className="relative inline-flex">
        <BrandLogo variant="header" />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 -left-1 h-7 w-12 drop-shadow-sm"
          viewBox="0 0 40 23"
        >
          <path
            d="M8 17C10 10 14 4 21 3C27 2 32 5 35 10L30 13L26 9L28 14Z"
            fill="#d62d48"
            stroke="#8c1830"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M11 14C14 8 17 6 22 5"
            fill="none"
            stroke="#fa8090"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 16L27 12C30 11.5 31 17 28 17.5L9 22C6 22.5 5 16.5 8 16Z"
            fill="#fff8ee"
            stroke="#cbd5e1"
          />
          <circle cx="35" cy="11" r="4" fill="#fff8ee" stroke="#cbd5e1" />
        </svg>
      </span>
    </Link>
  );
}
