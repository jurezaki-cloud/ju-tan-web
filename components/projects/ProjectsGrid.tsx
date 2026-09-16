import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

type ProjectsGridProps = {
  items: Project[];
  labelledBy: string;
  id: string;
};

export default function ProjectsGrid({
  items,
  labelledBy,
  id,
}: ProjectsGridProps) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className="mx-auto grid max-w-[1280px] auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
        {items.map((project) => (
          <div key={project.title} className="flex h-full min-w-0 w-full">
            <ProjectCard project={project} />
          </div>
        ))}
    </div>
  );
}
