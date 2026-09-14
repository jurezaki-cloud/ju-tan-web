import { projects } from "@/lib/data/projects";
import { Stagger, StaggerItem } from "@/components/animations";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <StaggerItem key={project.title} className="h-full">
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
