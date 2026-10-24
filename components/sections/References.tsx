import Link from "next/link";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import { portfolioProjects } from "@/lib/data/portfolio";

const inquiryHref = "/kontakt?storitev=Nisem%20prepri%C4%8Dan%20%2F%20Drugo";

export default function References({ full = false }: { full?: boolean }) {
  const titleClass = `${full ? "heading-hero" : "heading-display"} font-heading font-semibold`;

  return (
    <Section labelledBy="references-title" className="bg-[#050816] light:bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
          REFERENCE JU-TAN
        </p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            {full ? (
              <h1 id="references-title" className={`${titleClass} text-white light:text-slate-900`}>
                Projekti, ki jih lahko preverite.
              </h1>
            ) : (
              <h2 id="references-title" className={`${titleClass} text-white light:text-slate-900`}>
                Izbrani projekti
              </h2>
            )}
            <p className="mt-4 max-w-2xl text-slate-400 light:text-slate-600">
              Spletne predstavitve, portali, lastni poslovni program in grafično
              oblikovanje. Opisani so samo projekti in izdelki z javno povezavo.
            </p>
          </div>
          {!full ? (
            <Link
              href="/reference"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              Vse reference
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {portfolioProjects.map((project) => {
            const external = project.href.startsWith("http");
            const body = (
              <>
                <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/5 to-transparent p-5 light:border-slate-200">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden />
                  <p className="relative text-[10px] font-semibold tracking-[0.22em] text-emerald-400">
                    {project.accent}
                  </p>
                  <h3 className="relative mt-8 font-heading text-2xl font-semibold text-white light:text-slate-900">
                    {project.title}
                  </h3>
                  <p className="relative mt-1 text-xs text-slate-400 light:text-slate-600">
                    {project.context}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-400">
                  {project.type}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                  {project.summary}
                </p>
                {full ? (
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Namen
                      </dt>
                      <dd className="mt-1 leading-6 text-slate-300 light:text-slate-700">
                        {project.objective}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Rešitev
                      </dt>
                      <dd className="mt-1 leading-6 text-slate-300 light:text-slate-700">
                        {project.solution}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Ključno delovanje
                      </dt>
                      <dd className="mt-1">
                        <ul className="list-disc space-y-1 pl-4 leading-6 text-slate-300 light:text-slate-700">
                          {project.functionality.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Korist
                      </dt>
                      <dd className="mt-1 leading-6 text-slate-300 light:text-slate-700">
                        {project.benefits}
                      </dd>
                    </div>
                  </dl>
                ) : null}
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 light:border-slate-200 light:text-slate-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold text-emerald-400">
                  {project.linkLabel}
                  {external ? (
                    <span className="sr-only"> (odpre se v novem zavihku)</span>
                  ) : null}
                </p>
              </>
            );
            const className =
              "group block rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_70px_rgba(22,163,74,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 light:border-slate-200 light:bg-white";

            return external ? (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {body}
              </a>
            ) : (
              <Link key={project.title} href={project.href} className={className}>
                {body}
              </Link>
            );
          })}
        </div>

        {full ? (
          <div className="mt-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-7 sm:p-10">
            <h2 className="heading-display font-heading font-semibold text-white light:text-slate-900">
              Imate podoben projekt?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 light:text-slate-600">
              Opišite, kaj potrebujete. Skupaj preverimo, ali je pravi naslednji
              korak spletna stran, grafična podoba, video ali programska rešitev.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href={inquiryHref}>Pošljite povpraševanje</CtaLink>
              <CtaLink href="/videoprodukcija" variant="secondary">
                Videoprodukcija
              </CtaLink>
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
