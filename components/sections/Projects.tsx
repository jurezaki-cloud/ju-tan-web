import {
  ArrowUpRight,
  Brain,
  Globe,
  Monitor,
  Palette,
  Server,
  Video,
} from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

const projects = [
  {
    title: "JU-TAN Office",
    category: "Desktop ERP",
    tech: ["Python", "PySide6", "SQLite"],
    icon: Monitor,
  },
  {
    title: "JU-TAN Studio",
    category: "Corporate Website",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
    icon: Globe,
  },
  {
    title: "AI Agent",
    category: "Artificial Intelligence",
    tech: ["OpenAI", "Automation", "n8n"],
    icon: Brain,
  },
  {
    title: "Brand Identity",
    category: "Graphic Design",
    tech: ["Illustrator", "Photoshop"],
    icon: Palette,
  },
  {
    title: "Video Production",
    category: "Commercial Video",
    tech: ["Premiere", "After Effects"],
    icon: Video,
  },
  {
    title: "Cloud Infrastructure",
    category: "Networking",
    tech: ["Windows", "Docker", "Cloud"],
    icon: Server,
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#08101f] py-32 text-white"
    >
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="Portfolio"
          title="Izbrani projekti"
          description="Nekaj rešitev, ki prikazujejo naše znanje na področju umetne inteligence, razvoja programske opreme, spletnih aplikacij in digitalnega oblikovanja."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;

            return (
              <Card
                key={project.title}
                className="group relative overflow-hidden p-0"
              >
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-green-500/10 to-transparent">
                  <Icon className="h-20 w-20 text-green-400 transition duration-300 group-hover:scale-110 group-hover:rotate-6" />

                  <div className="absolute right-5 top-5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-black">
                    Featured
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-sm uppercase tracking-widest text-green-400">
                    {project.category}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {project.title}
                  </h3>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <button className="mt-8 flex items-center gap-2 font-semibold text-green-400 transition group-hover:translate-x-1">
                    Več o projektu
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
