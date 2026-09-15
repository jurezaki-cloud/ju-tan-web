import CoreMark from "@/components/common/CoreMark";

type SectionTitleProps = {
  index?: string;
  badge: string;
  title: string;
  description?: string;
  heading?: "h1" | "h2";
};

export default function SectionTitle({
  index,
  badge,
  title,
  description,
  heading = "h2",
}: SectionTitleProps) {
  const Heading = heading;

  return (
    <div className="mb-9 max-w-2xl">
      <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
        <CoreMark className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        {index ? (
          <span className="tabular-nums text-green-600/80">{index}</span>
        ) : null}
        {badge}
      </p>

      <Heading className="heading-display mt-3.5 mb-3 font-heading font-semibold leading-[1.14] tracking-[-0.038em] break-words text-white light:text-slate-900">
        {title}
      </Heading>

      {description ? (
        <p className="max-w-[38rem] text-[16px] leading-[1.7] tracking-[-0.012em] text-slate-400 md:text-[17px]">
          {description}
        </p>
      ) : null}

      <div className="plate-rule mt-6" aria-hidden />
    </div>
  );
}
