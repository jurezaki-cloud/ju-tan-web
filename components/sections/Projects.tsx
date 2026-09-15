"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectFilters from "@/components/projects/ProjectFilters";
import PremiumCTA from "@/components/common/PremiumCTA";
import {
  projectMatchesFilter,
  projects,
  type ProjectFilter,
} from "@/lib/data/projects";

const GRID_ID = "projects-grid";

export default function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>("Vse");

  const visibleProjects = useMemo(
    () => projects.filter((project) => projectMatchesFilter(project, filter)),
    [filter],
  );

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="below-fold relative overflow-hidden section-y"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />

      <div className="container relative max-w-6xl overflow-x-hidden">
        <FadeIn>
          <div id="projects-heading">
            <SectionTitle
              badge="Reference"
              title="Naši projekti"
              description="Podjetjem pomagamo avtomatizirati procese, razviti AI agente in izdelati sodobne spletne rešitve."
            />
          </div>
        </FadeIn>

        <ProjectFilters
          value={filter}
          onChange={setFilter}
          panelId={GRID_ID}
        />

        {visibleProjects.length === 0 ? (
          <p
            id={GRID_ID}
            role="status"
            className="min-h-[20rem] py-12 text-center text-slate-400"
          >
            Za izbrani filter trenutno ni projektov.
          </p>
        ) : (
          <ProjectsGrid
            id={GRID_ID}
            labelledBy={`project-filter-${filter.toLowerCase()}`}
            items={visibleProjects}
          />
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
