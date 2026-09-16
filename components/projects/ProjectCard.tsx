import { Check } from "lucide-react";
import type { Project } from "@/lib/types";
import BaseCard from "@/components/common/BaseCard";
import { cardIcon, headingCard, cardBodyClass } from "@/design";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon = project.icon;
  const meta = project.category.split("•").map((item) => item.trim());

  return (
    <BaseCard
      href="/kontakt"
      aria-label={`${project.title} — pošlji povpraševanje`}
      className="flex h-full min-h-[300px] flex-col"
    >
      <span className={`mb-4 ${cardIcon}`}>
        <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
      </span>

      {project.conceptual ? (
        <p className="mb-2 inline-flex self-start rounded-lg border border-white/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
          Konceptualni primer
        </p>
      ) : null}

      <ul className="mb-3 flex flex-wrap items-center gap-x-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
        {meta.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="text-white/20 light:text-slate-300" aria-hidden>
                ·
              </span>
            ) : null}
            {label}
          </li>
        ))}
      </ul>

      <h3 className={headingCard}>{project.title}</h3>

      <p className={`mt-2 ${cardBodyClass}`}>{project.description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <li key={tech}>
            <span className="inline-flex rounded-lg border border-white/10 px-2 py-0.5 text-[11px] tracking-[0.02em] text-slate-400">
              {tech}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-auto inline-flex items-start gap-2 self-start pt-6 text-[13px] leading-[1.45] text-slate-300">
        <Check
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16a34a]"
          strokeWidth={2.4}
          aria-hidden
        />
        {project.result}
      </p>
    </BaseCard>
  );
}
