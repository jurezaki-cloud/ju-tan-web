"use client";

import { useEffect, useRef } from "react";
import { company } from "@/lib/data/company";

export default function ContactSuccess() {
  const confirmationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    confirmationRef.current?.focus();
  }, []);
  return (
    <div
      ref={confirmationRef}
      tabIndex={-1}
      role="status"
      className="border-t border-white/[0.08] py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
    >
      <h2 className="heading-display font-heading font-semibold text-white light:text-slate-900">
        Povpraševanje je oddano.
      </h2>
      <p className="mt-3 max-w-md text-[16px] leading-[1.7] text-slate-400 light:text-slate-600">
        Hvala za sporočilo. Pregledali bomo vaše potrebe in vas kontaktirali na
        navedeni e-poštni naslov. Ponovna oddaja ni potrebna.
      </p>
      <p className="mt-4 text-sm text-slate-400 light:text-slate-600">
        Če želite kaj dopolniti, pišite na{" "}
        <a
          href={`mailto:${company.contact.email}`}
          className="font-medium text-emerald-500 underline"
        >
          {company.contact.email}
        </a>
        .
      </p>
    </div>
  );
}
