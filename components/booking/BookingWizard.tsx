"use client";

import CTAButton from "@/components/navbar/CTAButton";

export default function BookingWizard() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-card backdrop-blur-xl sm:px-10 light:border-slate-200 light:bg-white">
      <p className="mx-auto max-w-xl text-[16px] leading-[1.7] text-slate-300 light:text-slate-600">
        Po oddaji povpraševanja vas bomo kontaktirali za dogovor termina.
      </p>
      <div className="mt-6 flex justify-center">
        <CTAButton href="/#contact">Oddajte povpraševanje</CTAButton>
      </div>
    </div>
  );
}
