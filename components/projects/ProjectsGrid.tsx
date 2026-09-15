"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 overflow-hidden md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {items.map((project, index) => (
          <motion.div
            key={project.title}
            layout={!reduceMotion}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.35,
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
