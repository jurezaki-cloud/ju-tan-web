"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/animations";

type ProjectCardProps = {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  delay?: number;
};

export default function ProjectCard({
  title,
  category,
  description,
  technologies,
  image,
  delay = 0,
}: ProjectCardProps) {
  return (
    <FadeIn delay={delay}>
      <article className="group mx-auto flex h-[250px] max-w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(34,197,94,.18)]">
        <div className="relative w-[42%] shrink-0 overflow-hidden bg-gradient-to-br from-green-500/15 to-transparent">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 40vw, 140px"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4">
          <p className="text-[11px] uppercase tracking-[2px] text-green-400">
            {category}
          </p>

          <div className="mt-1.5 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight text-white">{title}</h3>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-green-400 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>

          <p className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-slate-400">
            {description}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {technologies.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
