import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { projectStudies, type ProjectStudy } from "@/lib/data/project-studies";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projectStudies.map(({ slug }) => ({ slug }));
}
function findProject(slug: string): ProjectStudy | undefined {
  return projectStudies.find((project) => project.slug === slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: `/reference/${project.slug}`,
  });
}
export default async function ProjectPage({ params }: Props) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  const path = `/reference/${project.slug}`;
  const breadcrumbId = `breadcrumb-${project.slug}`;
  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <Section
          labelledBy="project-title"
          className="bg-[#050816] light:bg-slate-50"
        >
          <article className="mx-auto max-w-4xl">
            <nav
              aria-label="Drobtinice"
              className="text-sm text-slate-400 light:text-slate-600"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="text-emerald-500">
                    Domov
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/reference" className="text-emerald-500">
                    Reference
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{project.name}</li>
              </ol>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-emerald-500">
              {project.kind}
            </p>
            <h1
              id="project-title"
              className="heading-hero mt-4 font-heading font-semibold"
            >
              {project.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 light:text-slate-600">
              {project.description}
            </p>
            {project.screenshot ? (
              <figure className="mt-8">
                <Image
                  src={project.screenshot.src}
                  alt={project.screenshot.alt}
                  width={project.screenshot.width}
                  height={project.screenshot.height}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="h-auto w-full rounded-2xl border border-white/10 light:border-slate-200"
                />
                <figcaption className="mt-3 text-sm text-slate-400 light:text-slate-600">
                  {project.screenshot.caption}
                </figcaption>
              </figure>
            ) : null}
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {[
                ["Cilj projekta", project.challenge],
                ["Rešitev", project.solution],
                ["Opravljeno delo", project.work],
                ["Rezultat", project.outcome],
              ].map(([title, text]) => (
                <section
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 light:border-slate-200 light:bg-white"
                >
                  <h2 className="font-heading text-xl font-semibold">
                    {title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                    {text}
                  </p>
                </section>
              ))}
            </div>
            {project.audience ? (
              <section className="mt-12" aria-labelledby="project-audience">
                <h2
                  id="project-audience"
                  className="font-heading text-2xl font-semibold"
                >
                  Za koga je projekt?
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                  {project.audience}
                </p>
              </section>
            ) : null}
            {project.capabilities ? (
              <section className="mt-12" aria-labelledby="project-capabilities">
                <h2
                  id="project-capabilities"
                  className="font-heading text-2xl font-semibold"
                >
                  Kaj rešitev omogoča?
                </h2>
                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {project.capabilities.map((feature) => (
                    <li
                      key={feature.title}
                      className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 light:border-slate-200 light:bg-white"
                    >
                      <h3 className="font-heading text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400 light:text-slate-600">
                        {feature.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-5">
              {project.href.startsWith("https:") ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-500"
                >
                  Obiščite projekt ↗
                </a>
              ) : (
                <Link
                  href={project.href}
                  className="font-semibold text-emerald-500"
                >
                  Oglejte si program →
                </Link>
              )}
              <Link
                href={project.service}
                className="font-semibold text-emerald-500"
              >
                {project.serviceName} →
              </Link>
            </div>
            <section className="mt-12" aria-labelledby="related-projects">
              <h2
                id="related-projects"
                className="font-heading text-2xl font-semibold"
              >
                Oglejte si še druge projekte JU-TAN
              </h2>
              <ul className="mt-5 flex flex-wrap gap-5">
                {projectStudies
                  .filter((item) => item.slug !== project.slug)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/reference/${item.slug}`}
                        className="font-semibold text-emerald-500"
                      >
                        {item.name} →
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
            <section className="mt-12 rounded-3xl border border-emerald-500/20 p-7">
              <h2 className="font-heading text-2xl font-semibold">
                Načrtujete podoben projekt?
              </h2>
              <p className="mt-3 text-slate-400 light:text-slate-600">
                Predstavite nam svoj cilj, uporabnike in želene funkcionalnosti.
                Skupaj določimo obseg rešitve.
              </p>
              <Link
                href="/kontakt"
                className="mt-5 inline-block font-semibold text-emerald-500"
              >
                Pogovorimo se o projektu →
              </Link>
            </section>
          </article>
        </Section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "Reference", path: "/reference" },
                  { name: project.name, path },
                ],
                breadcrumbId,
              ),
              {
                "@type": "WebPage",
                "@id": `${absoluteUrl(path)}#webpage`,
                url: absoluteUrl(path),
                name: project.title,
                description: project.description,
                inLanguage: "sl",
                isPartOf: { "@id": absoluteUrl("/#website") },
                breadcrumb: { "@id": absoluteUrl(`/#${breadcrumbId}`) },
                about: {
                  "@type": "CreativeWork",
                  name: project.name,
                  url: absoluteUrl(project.href),
                  creator: { "@id": absoluteUrl("/#organization") },
                },
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}
