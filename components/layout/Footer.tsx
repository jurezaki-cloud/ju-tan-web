import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { FadeIn } from "@/components/animations";
import CTAButton from "@/components/navbar/CTAButton";

const companyLinks = [
  { label: "Domov", href: "/" },
  { label: "Zakaj JU-TAN", href: "/#about" },
  { label: "Projekti", href: "/#projects" },
  { label: "Kontakt", href: "/#contact" },
];

const linkClass =
  "rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050816]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[28rem] -translate-x-1/2 rounded-full bg-green-500/10 blur-[90px]" />

      <FadeIn>
        <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
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
              <CTAButton className="inline-flex rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition duration-[250ms] hover:-translate-y-0.5 hover:shadow-green-500/40">
                Brezplačen posvet
              </CTAButton>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-[18px] font-semibold tracking-[-0.03em] text-white">
              Podjetje
            </h3>
            <ul className="space-y-3 text-slate-400">
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
            <h3 className="mb-4 font-heading text-[18px] font-semibold tracking-[-0.03em] text-white">
              Storitve
            </h3>
            <ul className="space-y-3 text-slate-400">
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
            <h3 className="mb-4 font-heading text-[18px] font-semibold tracking-[-0.03em] text-white">
              Kontakt
            </h3>
            <div className="space-y-3 text-slate-400">
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
              <p>{company.contact.hours}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} JU-TAN. Vse pravice pridržane.
      </div>
    </footer>
  );
}
