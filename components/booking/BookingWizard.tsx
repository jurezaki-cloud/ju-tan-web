"use client";

import CTAButton from "@/components/navbar/CTAButton";
import { bookingNotice } from "@/lib/data/booking";

export default function BookingWizard() {
  return (
    <div className="surface-card px-6 py-10 text-center sm:px-10 light:border-slate-200 light:bg-white">
      <p className="mx-auto max-w-xl text-[16px] leading-[1.7] text-slate-300 light:text-slate-600">
        {bookingNotice}
      </p>
      <div className="mt-6 flex justify-center">
        <CTAButton href="/#contact">Oddajte povpraševanje</CTAButton>
      </div>
    </div>
  );
}
