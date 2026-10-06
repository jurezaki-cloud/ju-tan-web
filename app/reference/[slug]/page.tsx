import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { projectStudies } from "@/lib/data/project-studies";
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
function findProject(slug: string) {
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
            <Link
              href="/reference"
              className="text-sm font-semibold text-emerald-500"
            >
              ← Vse reference
            </Link>
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
