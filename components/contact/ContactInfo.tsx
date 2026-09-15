"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/lib/data/company";

const details = [
  {
    icon: Phone,
    title: company.contact.phoneLabel,
    value: company.contact.phone,
    href: company.contact.phoneTel,
  },
  {
    icon: Phone,
    title: company.contact.phoneSecondaryLabel,
    value: company.contact.phoneSecondary,
    href: company.contact.phoneSecondaryTel,
  },
  {
    icon: Mail,
    title: "E-pošta",
    value: company.contact.email,
    href: `mailto:${company.contact.email}`,
  },
  {
    icon: Clock,
    title: "Delovni čas",
    value: company.contact.hours,
  },
];

export default function ContactInfo() {
  return (
    <div className="grid gap-4">
      {details.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 py-0 shadow-card backdrop-blur-xl transition duration-[250ms] hover:-translate-y-1 hover:border-green-400/40 hover:shadow-card-hover"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.5rem] bg-green-500/10 text-green-400">
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[14px] font-medium text-green-400">
                  {item.title}
                </p>
                {"href" in item && item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center whitespace-pre-line text-[16px] font-semibold text-white transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-slate-900"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="whitespace-pre-line text-[16px] font-semibold text-white light:text-slate-900">
                    {item.value}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
