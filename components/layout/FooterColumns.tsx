import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Clock, Mail, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { company } from "@/lib/data/company";
import { hoverTransition } from "@/design";
import FooterCompanyNav from "./FooterCompanyNav";
import { cn } from "@/lib/utils";

const mapsQuery = encodeURIComponent(
  `${company.contact.address.name}, ${company.contact.address.street}, ${company.contact.address.postal}, ${company.contact.address.country}`,
);

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

const solutionAreas = [
  { label: "Splet", href: "/spletne-strani-in-ui-ux" },
  { label: "Programska oprema", href: "/razvoj-programske-opreme" },
  { label: "Poslovni sistemi", href: "/#services" },
  { label: "JU-TAN Office", href: "/ju-tan-office" },
] as const;

const brandDescriptor = "Digitalne rešitve in programski inženiring.";
const brandCopy =
  "Oblikovanje, razvoj in tehnologijo povezujemo v digitalne rešitve, programsko opremo in poslovne sisteme za dolgoročno uporabo.";

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
  "group flex items-start gap-3 rounded-lg px-0 py-2.5 text-slate-300",
  hoverTransition,
  "hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 light:text-slate-700 light:hover:text-slate-900",
);

const iconClass = "h-4 w-4 text-[#16a34a]";

export default function FooterColumns() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-10">
      <div className="border-b border-white/10 pb-8 light:border-slate-200 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
        <article aria-labelledby="footer-brand-heading">
          <BrandLogo variant="footer" alt="JU-TAN logotip" />
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#16a34a]">
            JU-TAN
          </p>
          <h2
            id="footer-brand-heading"
            className="mt-3 max-w-[18ch] font-heading text-[clamp(1.85rem,3.4vw,2.75rem)] font-semibold tracking-[-0.045em] text-white light:text-slate-900"
          >
            {brandDescriptor}
          </h2>
          <p className="mt-4 max-w-[40rem] text-[15px] leading-[1.65] tracking-[-0.012em] text-slate-400 light:text-slate-600">
            {brandCopy}
          </p>
        </article>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
          <nav aria-labelledby="footer-company-nav-heading">
            <p
              id="footer-company-nav-heading"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500"
            >
              JU-TAN
            </p>
            <FooterCompanyNav />
          </nav>

          <nav aria-labelledby="footer-solutions-nav-heading">
            <p
              id="footer-solutions-nav-heading"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500"
            >
              Rešitve
            </p>
            <ul className="mt-4 divide-y divide-white/10 light:divide-slate-200">
              {solutionAreas.map((area) => (
                <li key={area.label}>
                  <Link
                    href={area.href}
                    className={cn(
                      "group flex min-h-10 items-center gap-3 rounded-lg py-2.5 text-[15px] leading-[1.5] text-slate-300",
                      hoverTransition,
                      "hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 light:text-slate-700 light:hover:text-slate-900",
                    )}
                    aria-label={area.label}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16a34a]/80"
                      aria-hidden
                    />
                    <span>{area.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <article aria-labelledby="footer-contact-heading">
        <p
          id="footer-contact-heading"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#16a34a]"
        >
          Kontakt
        </p>
        <ul className="mt-4 divide-y divide-white/10 light:divide-slate-200">
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
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center">
        <Icon className={iconClass} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">
          {row.label}
        </span>
        <span className="mt-0.5 block whitespace-pre-line text-[14px] leading-[1.55] text-slate-200 group-hover:text-white light:text-slate-800 light:group-hover:text-slate-900">
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
