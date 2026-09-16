import Link from "next/link";
import IdentityFrame from "@/components/identity/IdentityFrame";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

export default function AccessDeniedPage() {
  return (
    <IdentityFrame title="Ni dostopa">
      <p className="text-[14px] leading-[1.55] text-slate-400">
        Vloga nima dovoljenja za zahtevani modul.
      </p>
      <Link href="/login" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary, "mt-6")}>
        Prijava
      </Link>
    </IdentityFrame>
  );
}
