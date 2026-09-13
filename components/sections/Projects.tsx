import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="PROJECTS"
            title="Izbrani projekti"
            description="Nekaj rešitev, ki prikazujejo naše znanje na področju umetne inteligence, razvoja programske opreme, spletnih aplikacij in digitalnega oblikovanja."
          />
        </FadeIn>

        <ProjectsGrid />
      </div>
    </section>
  );
}
