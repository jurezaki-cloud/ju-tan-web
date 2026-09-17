import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";
import SectionTitle from "@/components/common/SectionTitle";
import PrivacyAccordionItem from "./PrivacyAccordionItem";
import PrivacyProgress from "./PrivacyProgress";
import PrivacyToc from "./PrivacyToc";
import {
  controllerFields,
  privacyChapters,
  privacyDisclaimer,
  privacyHero,
  privacyLastUpdated,
  privacySupervisor,
  type PrivacyBlock,
} from "@/lib/data/privacy";
import { cn } from "@/lib/utils";
import { cardSurface, insetSurface, noteSurface, textLinkClass } from "@/design";

function Blocks({ blocks }: { blocks: PrivacyBlock[] }) {
  return (
    <div className="space-y-5 text-[16px] leading-[1.9] text-[rgba(255,255,255,0.72)] light:text-slate-600">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={`p-${index}`}>{block.text}</p>;
        }
        if (block.type === "note") {
          return (
            <p
              key={`note-${index}`}
              className={noteSurface}
            >
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <ul key={`rights-${index}`} className="space-y-4">
            {block.items.map((item) => (
              <li
                key={item.title}
                className={insetSurface}
              >
                <p className="font-heading text-[15px] font-semibold text-white light:text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.8]">{item.text}</p>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export default function PrivacyPolicyContent() {
  return (
    <article id="privacy-article" className="relative pb-24 pt-8 md:pb-32 md:pt-12">
      <PrivacyProgress />

      <div className="container">
        <FadeIn className="mx-auto max-w-[900px] text-center">
          <SectionTitle
            heading="h1"
            align="center"
            className="mb-0"
            badge={privacyHero.kicker}
            title={privacyHero.title}
            description={privacyHero.description}
          />
          <p className="mt-5 text-[14px] text-slate-500 light:text-slate-500">
            Zadnja posodobitev: {privacyLastUpdated}
          </p>
        </FadeIn>

        <div className="relative mx-auto mt-14 grid max-w-[1140px] gap-10 lg:grid-cols-[240px_minmax(0,900px)] lg:items-start">
          <FadeIn y={0} duration={0.55} delay={0.08} className="hidden lg:block">
            <div className="privacy-toc-enter">
              <PrivacyToc chapters={privacyChapters} variant="sidebar" />
            </div>
          </FadeIn>

          <div className="min-w-0">
            <FadeIn y={16} duration={0.5} delay={0.1} className="lg:hidden">
              <PrivacyToc chapters={privacyChapters} variant="panel" />
            </FadeIn>

            <Stagger className="mt-8 space-y-4 lg:mt-0" stagger={0.06}>
              {privacyChapters.map((chapter, index) => (
                <StaggerItem key={chapter.id}>
                  <PrivacyAccordionItem
                    id={chapter.id}
                    number={chapter.number}
                    title={chapter.title}
                    defaultOpen={index === 0}
                  >
                    {chapter.id === "upravljavec" ? (
                      <dl className="mb-6 grid gap-3 sm:grid-cols-2">
                        {controllerFields.map((field) => (
                          <div
                            key={field.label}
                            className={cn(insetSurface, "bg-black/20 py-3 light:bg-white/80")}
                          >
                            <dt className="text-[12px] uppercase tracking-[0.12em] text-slate-500">
                              {field.label}
                            </dt>
                            <dd
                              className={cn(
                                "mt-1 text-[15px] leading-snug text-white light:text-slate-900",
                                field.pending && "text-[#86efac]/90",
                              )}
                            >
                              {field.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    <Blocks blocks={chapter.blocks} />

                    {chapter.id === "piskotki" ? (
                      <p className="mt-5">
                        <Link
                          href="/politika-piskotkov"
                          className={textLinkClass}
                        >
                          Politika piškotkov
                        </Link>
                      </p>
                    ) : null}
                  </PrivacyAccordionItem>
                </StaggerItem>
              ))}
            </Stagger>

            <FadeIn y={20} duration={0.55} delay={0.08} className="mt-8">
              <aside className="rounded-card border border-[#16a34a]/25 bg-[#16a34a]/8 p-6 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-green-500">
                  {privacySupervisor.title}
                </p>
                <p className="mt-3 font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                  {privacySupervisor.authority}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.7] text-slate-400 light:text-slate-600">
                  {privacySupervisor.details}
                </p>
                <p className="mt-3 text-[16px] leading-[1.9] text-[rgba(255,255,255,0.72)] light:text-slate-600">
                  {privacySupervisor.body}
                </p>
                <a
                  href={privacySupervisor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(textLinkClass, "mt-5 gap-2")}
                >
                  {privacySupervisor.urlLabel}
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </aside>
            </FadeIn>

            <FadeIn y={16} duration={0.5} className="mt-8">
              <p className={cn(cardSurface, "px-5 py-5 text-[14px] leading-[1.8] text-slate-400 light:text-slate-600")}>
                {privacyDisclaimer}
              </p>
            </FadeIn>

            <FadeIn y={12} duration={0.45} className="mt-10">
              <Link
                href="/kontakt"
                className={cn(textLinkClass, "text-[15px]")}
              >
                Nazaj na povpraševanje
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </article>
  );
}
