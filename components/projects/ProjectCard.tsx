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
      <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(34,197,94,.18)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-green-500/15 to-transparent">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
          <span className="absolute right-5 top-5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-black">
            Izpostavljeno
          </span>
        </div>

        <div className="p-6">
          <p className="text-sm uppercase tracking-[3px] text-green-400">
            {category}
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <ArrowUpRight className="mt-1 shrink-0 text-green-400 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>

          <p className="mt-4 leading-7 text-slate-400">{description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {technologies.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300"
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
