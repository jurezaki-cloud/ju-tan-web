import Link from "next/link";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass, kickerClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

const formats = [
  {
    index: "01",
    title: "Promocijski video",
    text: "Kratka zgodba podjetja, storitve ali izdelka z jasnim sporočilom.",
  },
  {
    index: "02",
    title: "Reels in kratke vsebine",
    text: "Vertikalni formati za družbena omrežja, pripravljeni za objavo.",
  },
  {
    index: "03",
    title: "Video oglasi",
    text: "Jedrnate različice za kampanje, kjer šteje prvih nekaj sekund.",
  },
  {
    index: "04",
    title: "Predstavitve",
    text: "Produktni in poslovni video, usklajen z grafično podobo.",
  },
] as const;

const inquiryHref = "/kontakt?service=video";

export default function CreativeProduction() {
  return (
    <Section
      id="video"
      labelledBy="video-title"
      belowFold
      innerClassName="overflow-x-hidden"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-14">
          <div className="min-w-0 max-w-[36rem]">
            <p className={kickerClass}>VIDEOPRODUKCIJA</p>
            <h2
              id="video-title"
              className="heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900"
            >
              Video, ki znamko poveže s stranko.
            </h2>
          </div>
          <p className={cn(bodyClass, "max-w-[38rem] text-slate-300 light:text-slate-600")}>
            Promocijske filme, Reels, oglase in predstavitve pripravimo kot del
            celotne digitalne podobe. Iz Cerknice za podjetja na Notranjskem in
            drugod po Sloveniji.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {formats.map((format) => (
            <li
              key={format.index}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 light:border-slate-200 light:bg-white"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#16a34a]">
                {format.index}
              </p>
              <h3 className="mt-4 font-heading text-[1.15rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                {format.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400 light:text-slate-600">
                {format.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <CtaLink href="/videoprodukcija" className="w-full sm:w-auto">
            Več o videoprodukciji
          </CtaLink>
          <Link href={inquiryHref} className={cn(textLinkClass, "min-h-11 text-[14px]")}>
            Pošljite povpraševanje za video
          </Link>
        </div>
      </div>
    </Section>
  );
}
