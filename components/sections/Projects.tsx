"use client";

import { useState } from "react";
import Section from "@/components/common/Section";
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
  const visibleProjects = projects.filter((project) =>
    projectMatchesFilter(project, filter),
  );

  return (
    <Section
      id="projects"
      belowFold
      labelledBy="projects-heading"
      innerClassName="overflow-x-hidden"
    >
      <FadeIn>
        <div id="projects-heading">
          <SectionTitle
            align="center"
            index="04"
            badge="Reference"
            title="Vrste projektov"
            description="Tipi sistemov in kaj podjetje pridobi. Brez imen strank. Kartice so konceptualni primeri."
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
          className="min-h-[12rem] py-8 text-center text-slate-400"
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
    </Section>
  );
}
