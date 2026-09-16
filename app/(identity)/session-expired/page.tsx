import Link from "next/link";
import IdentityFrame from "@/components/identity/IdentityFrame";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

export default function SessionExpiredPage() {
  return (
    <IdentityFrame title="Seja je potekla">
      <p className="text-[14px] leading-[1.55] text-slate-400">
        Prijavite se znova.
      </p>
      <Link href="/login" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary, "mt-6")}>
        Prijava
      </Link>
    </IdentityFrame>
  );
}
