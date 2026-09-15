"use client";

import CTAButton from "@/components/navbar/CTAButton";

export default function BookingWizard() {
  return (
    <div className="max-w-xl border-t border-white/[0.08] pt-8">
      <p className="text-[16px] leading-[1.7] text-slate-400 light:text-slate-600">
        Na spletu ni koledarja. Oddate povpraševanje, termin uskladimo po
        e-pošti ali telefonu.
      </p>
      <div className="mt-6">
        <CTAButton href="/#contact" aria-label="Rezervirajte termin">
          Rezerviraj termin
        </CTAButton>
      </div>
    </div>
  );
}
