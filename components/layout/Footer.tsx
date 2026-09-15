import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/data/services";
import { FadeIn } from "@/components/animations";
import CTAButton from "@/components/navbar/CTAButton";

const companyLinks = [
  { label: "Domov", href: "/" },
  { label: "Rešitve", href: "/#services" },
  { label: "Proces", href: "/#process" },
  { label: "Reference", href: "/#projects" },
  { label: "Kontakt", href: "/#contact" },
  { label: "Politika zasebnosti", href: "/#privacy" },
];

const linkClass =
  "inline-flex min-h-11 items-center rounded-[10px] py-1 text-slate-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050816]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <FadeIn>
        <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo/ju-tan-studio.png"
              alt="Logotip JU-TAN"
              width={220}
              height={70}
              sizes="180px"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto"
            />

            <p className="mt-4 text-sm leading-[1.7] text-slate-400">
              {company.description}
            </p>

            <div className="mt-5">
              <CTAButton size="compact" aria-label="Pošlji povpraševanje">
                Pošlji povpraševanje
              </CTAButton>
            </div>
          </div>

          <div>
            <h3 className="heading-3 mb-4 text-white">
              Podjetje
            </h3>
            <ul className="space-y-1 text-slate-400">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link className={linkClass} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-3 mb-4 text-white">
              Storitve
            </h3>
            <ul className="space-y-1 text-slate-400">
              {services.map((service) => (
                <li key={service.title}>
                  <Link className={linkClass} href="/#services">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-3 mb-4 text-white">
              Kontakt
            </h3>
            <div className="space-y-1 text-slate-400">
              <p>
                <a className={linkClass} href={`mailto:${company.contact.email}`}>
                  {company.contact.email}
                </a>
              </p>
              <p>
                <span className="mb-1 block text-[13px] text-slate-500">
                  {company.contact.phoneLabel}
                </span>
                <a className={linkClass} href={company.contact.phoneTel}>
                  {company.contact.phone}
                </a>
              </p>
              <p>
                <span className="mb-1 block text-[13px] text-slate-500">
                  {company.contact.phoneSecondaryLabel}
                </span>
                <a className={linkClass} href={company.contact.phoneSecondaryTel}>
                  {company.contact.phoneSecondary}
                </a>
              </p>
              <p className="pt-2">{company.contact.hours}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="border-t border-white/10 px-[max(1rem,env(safe-area-inset-left,0px))] pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-center text-sm text-slate-400">
        © {siteConfig.copyrightYear} JU-TAN. Vse pravice pridržane.{" "}
        <Link
          href="/#privacy"
          className="rounded-[10px] text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          Politika zasebnosti
        </Link>
      </div>
    </footer>
  );
}
