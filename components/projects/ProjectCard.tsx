"use client";

import type { Project } from "@/lib/types";
import CoreMark from "@/components/common/CoreMark";
import ProjectArt from "./ProjectArt";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full w-full flex-col overflow-hidden border-t border-white/[0.08] pt-6">
      <div className="relative overflow-hidden" aria-hidden>
        <ProjectArt kind={project.image} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col pt-5">
        {project.conceptual ? (
          <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            <CoreMark className="h-3.5 w-3.5 text-slate-500" />
            Konceptualni primer
          </p>
        ) : null}

        <h3 className="heading-3 text-white transition-colors duration-200 group-hover:text-slate-100 light:text-slate-900 light:group-hover:text-slate-700">
          {project.title}
        </h3>

        <p className="mt-1.5 text-[13px] font-medium tracking-[0.04em] text-slate-500">
          {project.category}
        </p>

        <p className="mt-3 text-[15px] leading-[1.7] text-slate-400">
          {project.description}
        </p>

        <p className="mt-3 text-[12px] leading-5 tracking-[0.02em] text-slate-500">
          {project.technologies.join("  ·  ")}
        </p>

        <p className="mt-auto pt-4 text-[14px] leading-[1.65] text-slate-300">
          <span className="font-medium text-green-600/85">Namen: </span>
          {project.result}
        </p>
      </div>
    </article>
  );
}
