"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className="grid auto-rows-fr grid-cols-1 items-stretch gap-10 overflow-hidden md:grid-cols-2 md:gap-12"
    >
      <AnimatePresence mode="popLayout">
        {items.map((project, index) => (
          <motion.div
            key={project.title}
            layout={!reduceMotion}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.28,
              delay: reduceMotion ? 0 : index * 0.06,
              ease: "easeOut",
            }}
            className="flex h-full min-w-0"
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
