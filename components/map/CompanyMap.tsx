import { ExternalLink, Navigation } from "lucide-react";
import {
  company,
  companyLocationLines,
  companyMaps,
} from "@/lib/data/company";

export default function CompanyMap() {
  return (
    <div className="mt-10 grid gap-4">
      <div className="rounded-[18px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl light:border-slate-200 light:bg-white">
        <p className="text-[14px] font-medium text-green-400">📍 Lokacija</p>
        <p className="mt-2 font-heading text-[22px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
          {company.name}
        </p>
        <p className="mt-3 whitespace-pre-line text-[16px] leading-[1.7] text-slate-300 light:text-slate-600">
          {companyLocationLines.join("\n")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#07111f] shadow-[0_24px_60px_rgba(0,0,0,0.35)] light:border-slate-200 light:bg-white">
        <iframe
          title={`Zemljevid: ${company.contact.location}`}
          src={companyMaps.embed}
          className="company-map-frame h-[min(70vw,480px)] min-h-[450px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center light:border-slate-200">
          <a
            href={companyMaps.open}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-4 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition duration-[250ms] hover:-translate-y-0.5 hover:shadow-green-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Odpri v Google Zemljevidih
          </a>
          <a
            href={companyMaps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/20 px-4 text-sm font-semibold text-white transition duration-[250ms] hover:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:border-slate-200 light:bg-slate-50 light:text-slate-900"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            Načrtuj pot
          </a>
        </div>
      </div>
    </div>
  );
}
