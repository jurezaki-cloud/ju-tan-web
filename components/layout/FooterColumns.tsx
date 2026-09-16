import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Clock, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { hoverTransition } from "@/design";
import { footerCardClass, FooterCardKicker, FooterCardTitle } from "./FooterCard";
import FooterCompanyNav from "./FooterCompanyNav";
import { cn } from "@/lib/utils";

const mapsQuery = encodeURIComponent(
  `${company.contact.address.name}, ${company.contact.address.street}, ${company.contact.address.postal}, ${company.contact.address.country}`,
);

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

type ContactRow = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  ariaLabel: string;
};

const contactRows: ContactRow[] = [
  {
    icon: Mail,
    label: "E-pošta",
    value: company.contact.email,
    href: `mailto:${company.contact.email}`,
    ariaLabel: `Pošlji e-pošto na ${company.contact.email}`,
  },
  {
    icon: Phone,
    label: company.contact.phoneLabel,
    value: company.contact.phone,
    href: company.contact.phoneTel,
    ariaLabel: `Pokliči ${company.contact.phoneLabel}: ${company.contact.phone}`,
  },
  {
    icon: Briefcase,
    label: company.contact.phoneSecondaryLabel,
    value: company.contact.phoneSecondary,
    href: company.contact.phoneSecondaryTel,
    ariaLabel: `Pokliči ${company.contact.phoneSecondaryLabel}: ${company.contact.phoneSecondary}`,
  },
  {
    icon: Clock,
    label: "Delovni čas",
    value: company.contact.hoursLines.join("\n"),
    ariaLabel: `Delovni čas: ${company.contact.hoursLines.join(", ")}`,
  },
  {
    icon: MapPin,
    label: "Naslov",
    value: [
      company.contact.address.name,
      company.contact.address.street,
      company.contact.address.postal,
      company.contact.address.country,
    ].join("\n"),
    href: mapsHref,
    ariaLabel: `Odpri naslov v Google Zemljevidih: ${company.contact.address.street}, ${company.contact.address.postal}`,
  },
];

const lineClass = cn(
  "group flex items-start gap-3 rounded-lg px-1 py-2.5 text-slate-300",
  hoverTransition,
  "hover:translate-x-px hover:text-white focus-visible:translate-x-px focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 light:text-slate-700 light:hover:text-slate-900",
);

const iconClass = "h-5 w-5 text-[#16a34a]";

export default function FooterColumns() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article className={footerCardClass}>
        <FooterCardKicker>Podjetje</FooterCardKicker>
        <p className="mt-4 text-[14px] leading-[1.65] text-slate-400 light:text-slate-600">
          JU-TAN razvija poslovne sisteme, AI agente, CRM, ERP, portale in
          avtomatizacije za podjetja.
        </p>
        <FooterCompanyNav />
      </article>

      <article className={footerCardClass}>
        <FooterCardKicker>Storitve</FooterCardKicker>
        <FooterCardTitle>Rešitve</FooterCardTitle>
        <ul className="mt-6 space-y-0.5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <li key={service.title}>
                <Link href="/#services" className={lineClass} aria-label={service.title}>
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center">
                    <Icon className={iconClass} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 self-center text-[15px] leading-[1.55]">
                    {service.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>

      <article className={cn(footerCardClass, "md:col-span-2 lg:col-span-1")}>
        <FooterCardKicker>Kontakt</FooterCardKicker>
        <FooterCardTitle>Stopite v stik</FooterCardTitle>
        <ul className="mt-6 space-y-1">
          {contactRows.map((row) => (
            <li key={row.label}>
              <ContactLine row={row} />
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function ContactLine({ row }: { row: ContactRow }) {
  const Icon = row.icon;
  const content = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon className={iconClass} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">
          {row.label}
        </span>
        <span className="mt-0.5 block whitespace-pre-line text-[15px] leading-[1.55] text-slate-200 group-hover:text-white light:text-slate-800 light:group-hover:text-slate-900">
          {row.value}
        </span>
      </span>
    </>
  );

  if (row.href) {
    const external = row.href.startsWith("http");
    return (
      <a
        href={row.href}
        className={lineClass}
        aria-label={row.ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return <div className={lineClass}>{content}</div>;
}
