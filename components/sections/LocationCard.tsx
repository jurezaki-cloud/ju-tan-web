import { company, companyLocationLines } from "@/lib/data/company";

export default function LocationCard() {
  return (
    <div
      id="location"
      className="mt-10 rounded-[18px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl light:border-slate-200 light:bg-white"
    >
      <p className="text-[14px] font-medium text-green-400">📍 Lokacija</p>
      <p className="mt-2 font-heading text-[22px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        {company.name}
      </p>
      <p className="mt-3 whitespace-pre-line text-[16px] leading-[1.7] text-slate-300 light:text-slate-600">
        {companyLocationLines.join("\n")}
      </p>

      <p className="mt-5 text-[14px] font-medium text-green-400">Telefon:</p>
      <p className="mt-1 grid gap-1 text-[16px] font-semibold text-white light:text-slate-900">
        <a
          href={company.contact.phoneTel}
          className="w-fit rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {company.contact.phone}
        </a>
        <a
          href={company.contact.phoneSecondaryTel}
          className="w-fit rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {company.contact.phoneSecondary}
        </a>
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={company.contact.phoneTel}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-4 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition duration-[250ms] hover:-translate-y-0.5 hover:shadow-green-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          📞 Pokliči
        </a>
        <a
          href="#contact-form"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-white/15 bg-black/20 px-4 text-sm font-semibold text-white transition duration-[250ms] hover:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:border-slate-200 light:bg-slate-50 light:text-slate-900"
        >
          ✉️ Pošlji povpraševanje
        </a>
      </div>
    </div>
  );
}
