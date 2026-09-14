import { projects } from "@/lib/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 md:mt-12">
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
