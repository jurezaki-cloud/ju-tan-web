"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
      <article className="group mx-auto flex h-[360px] w-full max-w-[360px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-xl transition duration-[250ms] hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(34,197,94,.18)]">
        <div className="relative h-[160px] shrink-0 overflow-hidden bg-gradient-to-br from-green-500/15 to-transparent">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-70" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          <p className="text-[14px] uppercase tracking-[2px] text-green-400">
            {category}
          </p>

          <h3 className="mt-1 line-clamp-1 text-[28px] font-bold leading-tight text-white">
            {title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[16px] leading-[1.65] text-slate-400">
            {description}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {technologies.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[14px] text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className="mt-auto inline-flex items-center gap-2 pt-3 text-[14px] font-semibold text-green-400 transition-all duration-[250ms] hover:gap-3 hover:text-green-300"
          >
            Več informacij
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </article>
    </FadeIn>
  );
}
