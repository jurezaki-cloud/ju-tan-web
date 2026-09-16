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
      <BrandLogo variant="header" />
    </Link>
  );
}
