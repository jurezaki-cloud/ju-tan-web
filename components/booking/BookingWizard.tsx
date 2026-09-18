import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass } from "@/design";
import { cn } from "@/lib/utils";

export default function BookingWizard() {
  return (
    <div className="flex flex-col items-center text-center">
      <p className={cn(bodyClass, "max-w-[40rem]")}>
        Na spletu ni koledarja. Oddate povpraševanje, termin uskladimo po
        e-pošti ali telefonu.
      </p>
      <CtaLink href="/kontakt" aria-label="Pošljite povpraševanje" className="mt-8">
        Pošljite povpraševanje
      </CtaLink>
    </div>
  );
}
