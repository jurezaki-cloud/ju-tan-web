import type { LucideIcon } from "lucide-react";

interface Props {
  step: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function ProcessCard({
  step,
  title,
  description,
  icon: Icon,
}: Props) {
  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/5 p-3 shadow-card backdrop-blur-xl transition-all duration-[250ms] hover:-translate-y-1 hover:border-green-400/40 hover:shadow-card-hover">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-lg font-black leading-none text-green-500">
          {step}
        </div>
        {Icon ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 text-green-400">
            <Icon size={12} />
          </div>
        ) : null}
      </div>

      <h3 className="heading-3 mb-0.5 line-clamp-1 text-[1.05rem] md:text-[1.125rem] text-white">
        {title}
      </h3>

      <p className="flex-1 text-[14px] leading-[1.6] text-slate-400">{description}</p>
    </div>
  );
}
