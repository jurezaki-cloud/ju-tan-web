import { projects } from "@/lib/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 md:mt-8 xl:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          title={project.title}
          category={project.category}
          description={project.description}
          technologies={project.technologies}
          image={project.image}
          delay={0.2 + index * 0.15}
        />
      ))}
    </div>
  );
}
