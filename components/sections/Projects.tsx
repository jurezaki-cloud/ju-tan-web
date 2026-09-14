"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import PremiumCTA from "@/components/common/PremiumCTA";
import {
  projectFilters,
  projectMatchesFilter,
  projects,
  type ProjectFilter,
} from "@/lib/data/projects";

export default function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>("Vsi");

  const visibleProjects = useMemo(
    () => projects.filter((project) => projectMatchesFilter(project, filter)),
    [filter],
  );

  return (
    <section id="projects" className="below-fold relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />

      <div className="container relative max-w-6xl overflow-x-hidden">
        <FadeIn>
          <SectionTitle
            badge="Projekti"
            title="Naši projekti"
            description="Razvijamo sodobne programske rešitve, AI sisteme, poslovne aplikacije in IT infrastrukturo po meri podjetij."
          />
        </FadeIn>

        <div
          className="-mt-4 mb-6 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filtri projektov"
        >
          {projectFilters.map((item) => {
            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item)}
                className={`min-h-11 rounded-full border px-4 py-2 text-[13px] font-medium backdrop-blur-xl transition duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  active
                    ? "border-green-400/50 bg-green-500/20 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.18)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-green-400/30 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {visibleProjects.length === 0 ? (
          <p role="status" className="min-h-[20rem] py-12 text-center text-slate-400">
            Za izbrani filter trenutno ni projektov.
          </p>
        ) : (
          <ProjectsGrid items={visibleProjects} />
        )}

        <div className="mt-8">
          <PremiumCTA
            title="Iščete partnerja za razvoj?"
            description="Pomagamo podjetjem razviti sodobne spletne rešitve, AI avtomatizacije in poslovne sisteme."
          />
        </div>
      </div>
    </section>
  );
}
