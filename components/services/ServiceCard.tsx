interface Props {
  index: string;
  title: string;
  description: string;
  features?: string[];
}

export default function ServiceCard({
  index,
  title,
  description,
  features = [],
}: Props) {
  return (
    <article className="plate-item -mx-3 grid gap-3 rounded-[10px] border-t border-white/[0.08] px-3 py-7 first:border-t-0 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-6">
      <span className="font-heading text-[13px] font-medium tabular-nums tracking-[0.14em] text-green-600/80">
        {index}
      </span>

      <div className="min-w-0">
        <h3 className="heading-3 text-white light:text-slate-900">{title}</h3>
        <p className="mt-2 text-[15px] leading-[1.7] text-slate-400">{description}</p>

        {features.length > 0 ? (
          <p className="mt-3 text-[13px] leading-6 tracking-[0.01em] text-slate-500">
            {features.join("  ·  ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
