import Link from "next/link";
import { siteConfig } from "@/lib/config";
import FooterColumns from "./FooterColumns";
import BrandLogo from "@/components/common/BrandLogo";
import { brandName } from "@/brand/theme";
import { cn } from "@/lib/utils";
import { colorTransition, focusRing } from "@/design";

const legalLinkClass = cn(
  "rounded-lg text-slate-300 hover:text-white light:text-slate-700 light:hover:text-slate-900",
  colorTransition,
  focusRing,
);

const legalLinks = [
  { href: "/politika-zasebnosti", label: "Privacy" },
  { href: "/politika-piskotkov", label: "Cookies" },
] as const;

export default function Footer() {
  const socialLinks = [
    siteConfig.github
      ? { href: siteConfig.github, label: "GitHub", external: true }
      : null,
    siteConfig.linkedin
      ? { href: siteConfig.linkedin, label: "LinkedIn", external: true }
      : null,
  ].filter((item): item is { href: string; label: string; external: true } =>
    Boolean(item),
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050816] light:border-slate-200 light:bg-slate-50">
      <div className="container py-12 md:py-14">
        <FooterColumns />
      </div>

      <div className="border-t border-white/10 light:border-slate-200">
        <div className="container flex flex-col items-center gap-3 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-center text-[13px] text-slate-400 sm:flex-row sm:justify-between light:text-slate-600">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#home"
              aria-label={`${brandName} domov`}
              className={cn("rounded-lg", focusRing)}
            >
              <BrandLogo variant="footer" />
            </Link>
            <p>© {siteConfig.copyrightYear} JU-TAN. Vse pravice pridržane.</p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={legalLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={legalLinkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
