"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type ProjectCardProps = {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  delay?: number;
};

const mockupThemes: Record<string, string> = {
  "ai-platform": "from-emerald-400/35 via-green-900/50 to-[#07111f]",
  office: "from-green-500/25 via-slate-800/80 to-[#07111f]",
  chatbot: "from-teal-400/30 via-emerald-900/50 to-[#07111f]",
  crm: "from-lime-400/20 via-green-950/70 to-[#07111f]",
  erp: "from-emerald-300/25 via-slate-900 to-[#07111f]",
  portal: "from-green-400/30 via-cyan-950/40 to-[#07111f]",
};

function ProjectMockup({ image, title }: { image: string; title: string }) {
  const theme = mockupThemes[image] ?? mockupThemes["ai-platform"];

  return (
    <div
      className={`relative h-[170px] overflow-hidden bg-gradient-to-br ${theme}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.28),transparent_55%)]" />
      <div className="absolute inset-x-4 top-4 rounded-xl border border-white/10 bg-black/25 p-3 shadow-lg backdrop-blur-md">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-green-400/80" />
          <span className="ml-2 truncate text-[10px] uppercase tracking-[0.18em] text-green-200/80">
            {title}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 rounded-md bg-white/10" />
          <div className="h-10 rounded-md bg-green-400/20" />
          <div className="h-10 rounded-md bg-white/10" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-1.5 w-[88%] rounded-full bg-white/15" />
          <div className="h-1.5 w-[64%] rounded-full bg-green-400/35" />
          <div className="h-1.5 w-[74%] rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({
  title,
  description,
  technologies,
  image,
}: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-[250ms] hover:border-green-400/40 hover:shadow-[0_20px_60px_rgba(34,197,94,0.18)]"
    >
      <ProjectMockup image={image} title={title} />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[28px] font-bold leading-tight text-white">
          {title}
        </h3>

        <p className="mt-2 line-clamp-3 text-[16px] leading-[1.65] text-slate-400">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {technologies.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[14px] text-gray-300"
            >
              {item}
            </span>
          ))}
        </div>

        <a
          href="#contact"
          className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-semibold text-green-400 transition-all duration-[250ms] hover:gap-3 hover:text-green-300"
        >
          Poglej projekt
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}
