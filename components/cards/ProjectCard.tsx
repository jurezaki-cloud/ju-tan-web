"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
}

export default function ProjectCard({
  title,
  category,
  image,
}: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-500 hover:border-green-500/40">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
      </div>

      <div className="p-7">
        <p className="text-sm uppercase tracking-[3px] text-green-400">
          {category}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            {title}
          </h3>

          <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </div>
  );
}
