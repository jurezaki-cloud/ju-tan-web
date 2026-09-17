import Link from "next/link";
import { siteConfig } from "@/lib/config";
import FooterColumns from "./FooterColumns";
import { cn } from "@/lib/utils";
import { colorTransition, focusRing } from "@/design";

const legalLinkClass = cn(
  "rounded-lg text-slate-300 hover:text-white light:text-slate-700 light:hover:text-slate-900",
  colorTransition,
  focusRing,
);

const legalLinks = [
  { href: "/politika-zasebnosti", label: "Zasebnost" },
  { href: "/politika-piskotkov", label: "Piškotki" },
] as const;

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050816] light:border-slate-200 light:bg-slate-50">
      <div className="container py-8 md:py-10">
        <FooterColumns />
      </div>

      <div className="border-t border-white/10 light:border-slate-200">
        <div className="container py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-[13px] text-slate-400 light:text-slate-600">
          <div className="flex flex-col items-center justify-between gap-2.5 text-center sm:flex-row sm:text-left">
            <nav aria-label="Pravne povezave">
              <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start">
                {legalLinks.map((item, index) => (
                  <li key={item.href} className="inline-flex items-center gap-3">
                    <Link href={item.href} className={legalLinkClass}>
                      {item.label}
                    </Link>
                    {index < legalLinks.length - 1 ? (
                      <span
                        className="text-slate-600/70 light:text-slate-400"
                        aria-hidden
                      >
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
            <p>© {siteConfig.copyrightYear} JU-TAN</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
