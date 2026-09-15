"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectFilters from "@/components/projects/ProjectFilters";
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent" />

      <div className="container relative overflow-x-hidden">
        <FadeIn>
          <div id="projects-heading">
            <SectionTitle
              index="04"
              badge="Reference"
              title="Primeri rešitev"
              description="Konceptualni primeri tipičnega dela — ne javne reference strank. Vsaka kartica je označena."
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

      </div>
    </section>
  );
}
