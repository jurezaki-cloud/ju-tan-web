"use client";

import { company } from "@/lib/data/company";

const details = [
  {
    title: company.contact.phoneLabel,
    value: company.contact.phone,
    href: company.contact.phoneTel,
  },
  {
    title: company.contact.phoneSecondaryLabel,
    value: company.contact.phoneSecondary,
    href: company.contact.phoneSecondaryTel,
  },
  {
    title: "E-pošta",
    value: company.contact.email,
    href: `mailto:${company.contact.email}`,
  },
  {
    title: "Delovni čas",
    value: company.contact.hours,
  },
];

export default function ContactInfo() {
  return (
    <div>
      {details.map((item) => (
        <div
          key={item.title}
          className="grid gap-1 border-t border-white/[0.08] py-5 first:border-t-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-6"
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {item.title}
          </p>
          {"href" in item && item.href ? (
            <a
              href={item.href}
              className="inline-flex min-h-11 items-center whitespace-pre-line text-[16px] font-medium text-white transition-colors duration-200 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 light:text-slate-900"
            >
              {item.value}
            </a>
          ) : (
            <p className="whitespace-pre-line text-[16px] font-medium text-white light:text-slate-900">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
