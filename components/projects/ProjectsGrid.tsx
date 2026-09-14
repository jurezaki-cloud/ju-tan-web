import { projects } from "@/lib/data/projects";
import { Stagger, StaggerItem } from "@/components/animations";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <Stagger className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <StaggerItem key={project.title} className="flex h-full">
          <ProjectCard
            title={project.title}
            category={project.category}
            description={project.description}
            technologies={project.technologies}
            image={project.image}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
