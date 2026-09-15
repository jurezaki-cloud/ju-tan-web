import { Badge } from "@/components/ui/badge";

type SectionTitleProps = {
  badge: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <Badge>{badge}</Badge>

      <h2 className="heading-display mt-3 mb-4 font-heading font-semibold leading-[1.15] tracking-[-0.03em] break-words text-white">
        {title}
      </h2>

      {description ? (
        <p className="mx-auto max-w-[42rem] text-[18px] leading-[1.7] tracking-[-0.01em] text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
