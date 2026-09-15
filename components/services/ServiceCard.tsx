import { ArrowRight, type LucideIcon } from "lucide-react";
import ServiceIcon from "./ServiceIcon";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  showCta?: boolean;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features = [],
  showCta = true,
}: Props) {
  return (
    <article className="surface-card group relative flex h-full min-h-[260px] flex-col overflow-hidden p-6 transition duration-[250ms] hover:-translate-y-2 hover:border-green-400/45 hover:bg-white/[0.07] hover:shadow-card-hover">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent opacity-0 transition duration-[250ms] group-hover:opacity-100" />
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 opacity-0 blur-3xl transition duration-[250ms] group-hover:opacity-100" />

      <ServiceIcon>
        <Icon size={28} aria-hidden />
      </ServiceIcon>

      <h3 className="heading-3 mb-2 line-clamp-2 min-h-[2.5em] text-white">
        {title}
      </h3>

      <p className="line-clamp-3 min-h-[4.8em] text-[15px] leading-[1.7] text-slate-400">
        {description}
      </p>

      {features.length > 0 ? (
        <ul className="mt-3 flex-1 space-y-1.5">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[14px] leading-5 text-slate-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              {feature}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      {showCta ? (
        <a
          href="#contact"
          className="mt-auto inline-flex min-h-11 items-center gap-2 rounded-sm pt-4 text-[14px] font-semibold text-green-400 transition-all duration-[250ms] hover:gap-3 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Več
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <div className="mt-auto min-h-11" />
      )}
    </article>
  );
}
