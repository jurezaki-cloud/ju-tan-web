import Link from "next/link";
import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import { textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

const solutionGroups = [
  {
    index: "01",
    title: "Splet in digitalne izkušnje",
    value:
      "Spletne strani, spletne trgovine in uporabniški vmesniki, kjer sta oblikovanje in tehnologija del iste rešitve.",
    labels: ["UI/UX", "Spletne strani", "E-trgovine", "Digitalne platforme"],
    href: "/spletne-strani-in-ui-ux",
    linkLabel: "Več o spletnih straneh in UI/UX",
  },
  {
    index: "02",
    title: "Programska oprema in aplikacije",
    value:
      "Spletne in mobilne aplikacije ter programska oprema po meri za procese, ki jih standardna orodja ne rešijo dovolj dobro.",
    labels: ["Spletne aplikacije", "Mobilne aplikacije", "Razvoj po meri", "API"],
    href: "/razvoj-programske-opreme",
    linkLabel: "Več o razvoju programske opreme",
  },
  {
    index: "03",
    title: "Poslovni sistemi in AI",
    value:
      "Povežemo podatke, procese in obstoječe sisteme ter avtomatiziramo delo tam, kjer tehnologija prinese dejansko korist.",
    labels: ["CRM", "ERP", "Avtomatizacija", "AI", "Integracije"],
  },
  {
    index: "04",
    title: "Svetovanje in dolgoročna podpora",
    value:
      "Od tehnične usmeritve do vzdrževanja, nadgradenj in nadaljnjega razvoja po uvedbi.",
    labels: ["Svetovanje", "Vzdrževanje", "Nadgradnje", "Podpora"],
  },
] as const;

export default function Services() {
  return (
    <Section id="services" belowFold className="pb-20 lg:pb-28">
      <FadeIn>
        <SectionTitle
          badge="REŠITVE"
          title="Od ideje do sistema, ki dela."
          description="Oblikovanje, razvoj in tehnologijo povezujemo v eno izvedbo. Tako digitalni produkt ni le dobro videti — ampak deluje, se povezuje in lahko raste skupaj s podjetjem."
          className="max-w-[60rem] mb-12 lg:mb-14"
          titleClassName="max-w-[48rem]"
          descriptionClassName="max-w-[46rem] light:text-slate-600"
        />
      </FadeIn>

      <div className="mx-auto w-full max-w-[1200px] border-t border-white/10 light:border-slate-200">
        <ol>
          {solutionGroups.map((group) => (
            <li
              key={group.index}
              className="group grid gap-3 border-b border-white/10 py-6 transition-colors duration-hover ease-out hover:border-[#16a34a]/30 lg:grid-cols-[4.5rem_minmax(0,30rem)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-4 lg:py-7 light:border-slate-200 light:hover:border-[#16a34a]/35"
            >
              <div className="pt-1 text-[12px] font-medium uppercase tracking-[0.2em] text-[#16a34a] light:text-[#15803d]">
                {group.index}
              </div>

              <div className="min-w-0">
                <h3 className="text-[22px] font-semibold tracking-[-0.05em] text-white transition-colors duration-hover ease-out group-hover:text-[#f0fdf4] sm:text-[24px] md:text-[27px] lg:text-[30px] light:text-slate-900 light:group-hover:text-slate-950">
                  {group.title}
                </h3>
              </div>

              <div className="min-w-0">
                <p className="max-w-[38rem] text-[15px] leading-[1.7] tracking-[-0.014em] text-slate-300 light:text-slate-700">
                  {group.value}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] leading-6 tracking-[-0.01em] text-slate-500 transition-colors duration-hover ease-out group-hover:text-slate-400 light:text-slate-500 light:group-hover:text-slate-600">
                  {group.labels.map((label, index) => (
                    <li key={label} className="flex items-center">
                      {index > 0 ? <span className="mr-3 text-[#16a34a]/45">·</span> : null}
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                {"href" in group && group.href ? (
                  <Link
                    href={group.href}
                    className={cn(textLinkClass, "mt-4 text-[13px] light:hover:text-slate-900")}
                  >
                    {group.linkLabel}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
