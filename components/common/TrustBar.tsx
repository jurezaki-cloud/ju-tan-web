import { heroCopy } from "@/components/hero/copy";

const itemText = [
  "Sistem se prilagodi vašim procesom, vlogam in načinu dela.",
  "Podatki, pravila in obstoječa orodja delujejo v istem toku.",
  "Izvorna koda, dokumentacija in nadaljnji razvoj ostanejo pri vas.",
] as const;

export default function TrustBar() {
  return (
    <section
      id="podrocja-sodelovanja"
      aria-label="Vrednostni most"
      className="relative border-y border-white/10 bg-[#08111d] light:border-slate-200 light:bg-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.02),transparent_16%,transparent_84%,rgba(22,163,74,0.02))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.18),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.08),transparent)]" />
      <div className="container relative grid gap-6 py-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-center lg:gap-10">
        <div className="max-w-[18rem]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-600">
            Temelj sodelovanja
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-slate-300 light:text-slate-700">
            Tri načela, na katerih gradimo povezan poslovni sistem za vaše podjetje.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(22,163,74,0.16),transparent)]" aria-hidden />
          <ul className="relative grid gap-0 overflow-hidden rounded-[1.6rem] border border-white/8 bg-white/[0.02] light:border-slate-200 light:bg-slate-50/80 md:grid-cols-3">
          {heroCopy.principles.map((item, index) => (
            <li
              key={item}
              className="relative px-5 py-4 sm:px-6 md:py-5"
            >
              {index > 0 ? (
                <>
                  <div className="absolute left-5 right-5 top-0 h-px bg-white/8 light:bg-slate-200 md:left-0 md:right-auto md:top-5 md:h-auto md:w-px md:bottom-5" aria-hidden />
                  <div className="absolute left-0 top-5 bottom-5 hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(22,163,74,0.18),transparent)] md:block" aria-hidden />
                </>
              ) : null}
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#16a34a] light:text-[#15803d]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                {item}
              </p>
              <p className="mt-2 max-w-[20rem] text-[14px] leading-[1.65] text-slate-400 light:text-slate-600">
                {itemText[index]}
              </p>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
