export default function TrustBar() {
  return (
    <section
      id="podrocja-sodelovanja"
      aria-label="Iz operativnega vsakdana"
      className="relative border-y border-white/10 bg-[#08111d] light:border-slate-200 light:bg-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.018),transparent_20%,transparent_80%,rgba(22,163,74,0.018))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.18),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.08),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(22,163,74,0.12),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(21,128,61,0.12),transparent)]" />

      <div className="container relative py-8 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10">
          <div className="max-w-[14rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 light:text-slate-600">
              Iz operativnega vsakdana
            </p>
          </div>

          <div className="relative min-w-0 border-l border-white/10 pl-4 sm:pl-6 lg:pl-8 light:border-slate-200">
            <div
              className="absolute left-0 top-0 h-10 w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0.45),transparent)] light:bg-[linear-gradient(to_bottom,rgba(21,128,61,0.35),transparent)]"
              aria-hidden
            />
            <p className="max-w-[52rem] text-[15px] leading-[1.85] tracking-[-0.014em] text-slate-300 sm:text-[16px] light:text-slate-700">
              V večini podjetij težava ni pomanjkanje orodij, temveč prehodi med njimi.
              Ko prodaja, operativa, dokumenti in odobritve ne delijo istega toka podatkov,
              vsak naslednji korak zahteva dodaten prenos, preverjanje ali usklajevanje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
