"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

type ProjectsGridProps = {
  items: Project[];
};

export default function ProjectsGrid({ items }: ProjectsGridProps) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((project) => (
          <motion.div
            key={project.title}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex h-full min-w-0"
          >
            <ProjectCard
              title={project.title}
              category={project.category}
              description={project.description}
              technologies={project.technologies}
              image={project.image}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
